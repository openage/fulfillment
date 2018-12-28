
const db = require('../models')
// const updateSchema = require('../helpers/updateEntities')
const customerService = require('./customers')
const productService = require('./products')
const batchesService = require('./batches')
// const offline = require('@open-age/offline-processor')

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

    const order = await new db.order(model).save()

    // await offline.queue('order', 'create', {id: order.id}, context)

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
// exports.update = async (model, id, context) => {
//     const log = context.logger.start('services/order:update')

//     const order = await db.order.findById(id)

//     set(model, order, context)

//     await order.save()
//     log.end()
//     return getById(order.id, context)
// }

exports.getById = getById
