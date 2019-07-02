
const db = require('../models')
const customerService = require('./customers')
const productService = require('./products')
const batchesService = require('./batches')
const stockService = require('./stocks')
const bapInvoiceProvider = require('../providers/bap/invoice')
const offline = require('@open-age/offline-processor')

const generateInvoice = async (order, context) => {
    let log = context.logger.start('services/orders:generateInvoice')

    let customerId = order.customer._doc ? order.customer.id : order.customer.toString()
    let customer = await customerService.getById(customerId, context)

    if (!customer) {
        throw new Error('customer not found')
    }

    let model = {
        order: {
            id: order.id || order._id.toString(),
            code: order.code
        },
        service: {
            code: 'inventory'
        },
        seller: {
            role: context.role
        },
        buyer: {
            role: customer.user.role
        },
        lineItems: []
    }

    for (let item of order.products) {
        let lineItem = {
            consumption: {
                quantity: item.quantity
            },
            parts: [{
                code: 'price',
                description: 'Price',
                amount: item.product.price || 0
            }],
            entity: {
                entityId: item.product._doc ? item.product.id : item.product.toString(),
                name: item.product._doc ? item.product.name : undefined,
                type: {
                    code: 'medicines'
                }
            },
            description: item.product._doc ? item.product.name : undefined
        }
        model.lineItems.push(lineItem)
    }

    let invoice = await bapInvoiceProvider.create(model, context.role.key, context)

    log.end()
    return invoice
}

const reduceStock = async (order, context) => {
    let log = context.logger.start('services/orders:reduceStock')

    if (!order || !order.products || !order.products.length) {
        return
    }

    for (let item of order.products) {
        let productId = item.product._doc ? item.product.id : item.product.toString()
        let stock = await stockService.findOneByQuery({
            product: productId
        }, context)

        let batchId = item.batch._doc ? item.batch.id : item.batch.toString()

        let batch = await batchesService.getById(batchId, context)

        if ((item.quantity > 0) && (batch.quantity < item.quantity)) {
            throw new Error('batch out of stock')
        } else {
            await batchesService.reduceQuantity(batchId, item.quantity)
        }

        if ((item.quantity > 0) && (stock.quantity < item.quantity)) {
            throw new Error('Out of stock')
        } else {
            await stockService.reduceQuantity(stock.id, item.quantity)
        }
    }

    log.end()
    return
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/orders:create')

    let customerData = model.customer || {
        role: context.role,
        organization: context.organization
    }

    let customer = await customerService.getOrCreate(customerData, context)

    if (!customer) {
        throw new Error('customer not found')
    }

    model.customer = customer

    if (!model.organization) {
        model.organization = context.organization.id
    }

    if (context.employee) {
        model.employee = context.employee
    }

    let productList = []

    for (const item of model.products) {
        let product = await productService.get(item.product, context)

        if (item.batch) {
            let batch = await batchesService.get(item.batch, context)

            if (batch.quantity < item.quantity) {
                throw new Error(`only '${batch.quantity}' item(s) available in batch '${batch.code}'`)
            }

            productList.push({
                product: product,
                batch: batch,
                amount: item.amount,
                quantity: item.quantity
            })
        } else {
            let batchResult = await batchesService.findByQuantity(item.quantity, item.product, context)

            if (!batchResult && !batchResult.length) {
                throw new Error(`this item is out of stock`)
            }

            for (const resultItem of batchResult.items) {
                let amount = (resultItem.price || 0) * (resultItem.quantity || 0)
                productList.push({
                    product: product,
                    batch: resultItem.batch,
                    price: resultItem.price,
                    amount: amount,
                    quantity: resultItem.quantity
                })
            }
        }
    }

    model.products = productList

    const order = await new db.order(model)

    if (model.status === 'invoiced') {
        await reduceStock(order, context)
        const invoice = await generateInvoice(order, context)
        order.invoice = invoice
    }

    await order.save()

    log.end()
    return db.order.findById(order.id).populate({
        path: 'customer employee organization store products.product products.batch'
    })
}

const getById = async (id, context) => {
    const log = context.logger.start('services/order:get')

    const order = await db.order.findById(id).populate({
        path: 'customer employee organization store products.product products.batch'
    })

    log.end()

    return order
}

exports.update = async (data, id, context) => {
    const log = context.logger.start('services/order:update')

    const order = await db.order.findById(id)

    if (data.status) {
        order.status = data.status
        order.statusLogs = order.statusLogs || []
        order.statusLogs.push({
            date: new Date(),
            old: order.status,
            new: data.status
        })
    }

    if (data.status === 'invoiced' && !order.invoice && !order.invoice.id) {
        await reduceStock(order, context)
        const invoice = await generateInvoice(order, context)
        order.invoice = invoice
        await order.save()
    } else {
        await order.save()
        context.processSync = true
        offline.queue('order', order.status, { id: order.id }, context)
    }

    log.end()
    return getById(order.id, context)
}

exports.getById = getById
