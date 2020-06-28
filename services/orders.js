
const db = require('../models')
const customerService = require('./customers')
const organizationService = require('./organizations')
const posService = require('./pos')
const userService = require('./users')
const storeService = require('./stores')
const productService = require('./products')
// const batchesService = require('./batches')
const stockService = require('./stocks')
const bapInvoice = require('../providers/bap/invoice')
const offline = require('@open-age/offline-processor')

const populate = 'products.product customer user pos store organization '

const set = async (model, entity, context) => {
    if (model.products) {
        entity.products = []

        for (const item of model.products) {
            entity.products.push({
                product: await productService.get(item.product, context),
                amount: item.amount,
                quantity: item.quantity
            })
        }
    }

    if (model.user) {
        entity.user = await userService.get(model.user, context)
    } else if (!entity.user && context.organization) {
        entity.user = context.user
    }

    if (model.customer) {
        entity.customer = await customerService.get(model.customer, context)
    }

    if (model.pos) {
        entity.pos = await posService.get(model.pos, context)
    }

    if (model.store) {
        entity.store = await storeService.get(model.store, context)
    }

    if (model.organization) {
        entity.organization = await organizationService.get(model.organization, context)
    }

    if (model.status && model.status !== entity.status) {
        if (model.status === 'invoiced') {
            await reduceStock(entity, context)
            entity.invoice = await bapInvoice.create(toInvoiceModel(entity), context)
        }

        entity.status = model.status
    }
}

const toInvoiceModel = (order) => {
    return {
        order: {
            id: order.id,
            code: order.code
        },
        service: {
            code: 'inventory'
        },
        seller: order.user,
        buyer: order.customer.user,
        lineItems: order.products(item => {
            return {
                consumption: {
                    quantity: item.quantity
                },
                parts: [{
                    code: 'price',
                    description: 'Price',
                    amount: item.product.price || 0
                }],
                entity: {
                    id: item.product.code,
                    name: item.product.name,
                    type: 'product'
                },
                description: item.product.name
            }
        })
    }
}

const reduceStock = async (order, context) => {
    let log = context.logger.start('services/orders:reduceStock')

    if (!order || !order.products || !order.products.length) {
        return
    }

    for (let item of order.products) {
        let stock = await stockService.get({
            product: item.product
        }, context)

        if ((item.quantity > 0) && (stock.quantity < item.quantity)) {
            throw new Error('Out of stock')
        } else {
            await stockService.reduceQuantity(stock.id, item.quantity)
        }
    }

    log.end()
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/orders:create')

    const entity = new db.order({
        organization: context.organization,
        tenant: context.tenant
    })

    await set(model, entity, context)
    await entity.save()
    await offline.queue('order', entity.status, entity, context)
    log.end()
    return entity
}

exports.update = async (id, model, context) => {
    const log = context.logger.start('services/order:update')

    let entity = await this.get(id, context)

    let oldStatus = entity.status

    await set(model, entity, context)
    await entity.save()
    if (oldStatus !== entity.status) {
        await offline.queue('order', entity.status, entity, context)
    }

    return entity
}

exports.search = async (query, page, context) => {
    const log = context.logger.start('api/order:search')
    const where = {
        tenant: context.tenant
    }

    if (query.status) {
        where.status = query.status
    }

    let items
    if (context.organization) {
        where.user = context.user
        where.organization = context.organization
        items = await db.order.find(where).populate(populate)
    } else {
        items = await db.order.aggregate([{
            $match: where
        }, {
            $lookup: {
                from: 'customers',
                localField: 'customer',
                foreignField: '_id',
                as: 'customer'
            }
        }, {
            $unwind: '$customer'
        }, {
            $match: {
                'customer.user': context.user
            }
        }])
    }

    log.end()

    return {
        items: items
    }
}

exports.get = async (query, context) => {
    context.logger.start('services/orders:get')
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.order.findById(query).populate(populate)
        } else {
            return db.order.findOne({
                code: query.toLocaleUpperCase(),
                organization: context.organization
            }).populate(populate)
        }
    }
    if (query._doc) {
        return query
    }
    if (query.id) {
        return db.order.findById(query.id).populate(populate)
    }
    if (query.code) {
        return db.order.findOne({
            code: query.code.toLocaleUpperCase(),
            organization: context.organization
        }).populate(populate)
    }
}
