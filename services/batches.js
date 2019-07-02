'use strict'

const db = require('../models')
const products = require('./products')
const stockService = require('./stocks')

const getByCode = async (code, context) => {
    const log = context.logger.start('services/batch:getByCode')

    const batch = await db.batch.findOne({
        code: code
    }).populate('product')

    log.end()
    return batch
}

const create = async (model, context) => {
    const log = context.logger.start('services/batch:create')
    let batch

    batch = await getByCode(model.code, context)
    if (batch) {
        throw new Error(`batch ${model.code} already exists`)
    }
    model.organization = context.organization
    model.tenant = context.tenant
    batch = await new db.batch({
        date: model.date,
        code: model.code,
        expiry: model.expiry,
        quantity: model.quantity,
        price: model.price,
        product: model.product
    }).save()

    log.end()
    return batch
}

exports.getById = async (id, context) => {
    const log = context.logger.start('services/batches:getById')

    const batch = await db.batch.findById(id)

    log.end()
    return batch
}

exports.search = async (where, context) => {
    const log = context.logger.start('services/batch:search')

    let query = {
        'quantity': {
            $gte: where.quantity || 1
        }
    }

    if (where.productId) {
        query.product = where.productId
    } else {
        return []
    }

    const batches = await db.batch.find(query)
    log.end()
    return batches
}

exports.findByQuantity = async (quantity, product, context) => {
    const log = context.logger.start('services/batch:search')

    product = await products.get(product, context)

    const stock = await stockService.findOneByQuery({
        product: product
    }, context)

    if (!stock) {
        throw new Error(`'${product.code}' is not in stock`)
    }

    if (stock.quantity < quantity) {
        throw new Error(`you can serve only '${stock.quantity}' item(s) for '${product.code}' product`)
    }

    let result = {
        price: stock.price,
        items: []
    }

    // TODO - sort the stock batches

    let leftQuantity = quantity

    for (const item of stock.batches) {
        if (item.quantity > leftQuantity) {
            result.items.push({
                batch: item.batch,
                price: item.price,
                quantity: leftQuantity
            })
            break
        }

        result.items.push({
            batch: item.batch,
            price: item.price,
            quantity: item.quantity
        })

        leftQuantity = leftQuantity - item.quantity
    }

    log.end()
    return result
}

const get = async (data, context) => {
    let log = context.logger.start('services/batch:get')
    let batch
    if (typeof data === 'string') {
        if (data.toObjectId()) {
            batch = await db.batch.findById(data)
        }
    }

    if (data.id) {
        batch = await db.batch.findById(data.id)
    }

    if (data.code) {
        batch = await getByCode(data.code, context)
    }

    if (!batch) {
        batch = await create({
            date: data.date,
            code: data.code,
            expiry: data.expiry,
            quantity: data.quantity,
            price: data.price,
            product: data.product
        }, context)
    }
    log.end()
    return batch
}

const reduceQuantity = async (id, number) => {
    return db.batch.update({
        _id: id
    }, {
            $inc: { quantity: number * -1 }
        })
}

exports.getByCode = getByCode
exports.get = get
exports.create = create
exports.reduceQuantity = reduceQuantity