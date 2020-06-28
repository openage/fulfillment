'use strict'
const db = require('../models')
const storeService = require('./stores')
const productService = require('./products')

const offline = require('@open-age/offline-processor')

const populate = 'product store organization'

const set = async (model, entity, context) => {
    if (model.price) {
        entity.price = model.price
    }
    if (model.quantity) {
        entity.quantity = model.quantity
    }

    if (model.unit) {
        entity.unit = model.unit
    }

    if (model.leadQuantity) {
        entity.leadQuantity = model.leadQuantity
    }

    if (model.position) {
        entity.position = model.position
    }

    if (model.batches) {
        entity.batches = model.batches.map(b => {
            return {
                date: b.date,
                expiry: b.expiry,
                price: b.price,
                quantity: b.quantity,
                unit: b.unit
            }
        })
    }

    if (model.store) {
        entity.store = await storeService.get(model.store, context)
    }
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/stocks:create')

    const entity = await new db.stock({
        product: await productService.get(model.product, context),
        organization: context.organization,
        tenant: context.tenant
    })
    await set(model, entity, context)
    await entity.save()

    await offline.queue('stock', 'create', entity, context)

    log.end()
    return entity
}

exports.update = async (id, model, context) => {
    context.logger.debug('services/products:update')

    let entity = await this.get(id, context)

    await set(model, entity, context)
    await entity.save()

    await offline.queue('stock', 'update', entity, context)

    return entity
}

exports.search = async (query, page, context) => {
    const log = context.logger.start('services/stocks:search')

    let productQuery = {}
    if (query.productName) {
        productQuery = {
            'product.name': {
                $regex: '^' + query.productName,
                $options: 'i'
            }
        }
    }

    let stockQuery = {
        'quantity': {
            $gte: query.quantity || 1
        },
        store: context.store,
        organization: context.organization
    }

    let stocks = await db.stock.aggregate([{
        $match: stockQuery
    }, {
        $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product'
        }
    }, {
        $unwind: '$product'
    }, {
        $match: productQuery
    }, {
        $limit: 10
    }])

    let items = await db.stock.populate(stocks, 'batches.batch')

    log.end()

    return {
        items: items
    }
}

// exports.buildStocks = async (data, context) => {
//     context.logger.start('services/stocks:buildStocks')

//     return new db.stock({
//         quantity: data.quantity,
//         location: data.location,
//         price: data.price,
//         leadQuantity: data.leadQuantity,
//         organization: context.organization,
//         store: context.store.id,
//         product: context.product.id,
//         batch: context.batch.id
//     })
// }
exports.get = async (query, context) => {
    context.logger.start('services/stocks:get')
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.stock.findById(query).populate(populate)
        } else {
            return db.stock.findOne({
                product: await productService.get(query, context),
                organization: context.organization
            }).populate(populate)
        }
    }
    if (query._doc) {
        return query
    }
    if (query.id) {
        return db.stock.findById(query.id).populate(populate)
    }
    if (query.product) {
        if (query.store) {
            return db.stock.findOne({
                product: await productService.get(query.product, context),
                store: await productService.get(query.store, context),
                organization: context.organization
            }).populate(populate)
        }
        return db.stock.findOne({
            product: await productService.get(query.product, context),
            organization: context.organization
        }).populate(populate)
    }
}

exports.reduce = async (id, number) => {
    return db.stock.update({
        _id: id
    }, {
        $inc: { quantity: number * -1 }
    })
}
