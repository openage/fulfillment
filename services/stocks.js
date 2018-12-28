'use strict'
const db = require('../models')
const storeService = require('../services/stores')
const batchService = require('../services/batches')
const productService = require('../services/products')

const set = (model, entity, context) => {
    if (model.quantity) {
        entity.quantity = model.quantity
    }

    if (model.leadQuantity) {
        entity.leadQuantity = model.leadQuantity
    }
    if (model.unit) {
        entity.unit = model.unit
    }

    if (model.position) {
        entity.position = model.position
    }
    if (model.price) {
        entity.price = model.price
    }
    if (model.batches) {
        for (let index = 0; index < model.batches.length; index++) {
            if (model.batches[index]) {
                entity.batches = model.batches
            }
        }
    }
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/stocks:create')

    let product = await productService.get(model.product, context) // get or create a product
    model.product = product
    let batchList = []

    for (let index = 0; index < model.batches.length; index++) {
        let item = model.batches[index]
        let obj = {}
        obj.batch = (await batchService.get({
            product: model.product,
            code: item.batch.code,
            quantity: item.batch.quantity,
            expiry: item.batch.expiry
        }, context))
        obj.quantity = obj.batch.quantity || 0
        obj.price = item.price
        obj.unit = item.unit
        batchList.push(obj)
    }

    model.batches = batchList
    let store
    if (model.store) {
        store = await storeService.get(model.store, context)
    } else { // get create store
        store = context.store
    }
    if (!store) {
        throw new Error(`store is required`)
    }
    model.store = store
    let stock = await findOneByQuery({ product: product.id }, context) // get stock for the product

    if (!model.organization) {
        model.organization = context.organization.id
    }

    if (!stock) {
        stock = await new db.stock({
            quantity: model.quantity,
            unit: model.unit,
            price: model.price,
            leadQuantity: model.leadQuantity,
            position: model.position,
            product: model.product,
            store: model.store,
            organization: context.organization,
            batches: model.batches
        }).save()
    } else {
        stock = await update({
            id: stock.id,
            quantity: model.quantity,
            unit: model.unit,
            position: model.position,
            price: model.price,
            leadQuantity: model.leadQuantity,
            batches: model.batches
        }, context)
    }

    log.end()
    return stock
}

const getById = async (id, context) => {
    const log = context.logger.start('services/stock:getById')

    const stock = await db.stock.findById(id).populate('organization')

    log.end()
    return stock
}

const update = async (model, context) => {
    const log = context.logger.start('services/stocks:update')
    const stock = await db.stock.findById(model.id)

    set({
        quantity: model.quantity,
        unit: model.unit,
        position: model.position,
        price: model.price,
        leadQuantity: model.leadQuantity
    }, stock, context)
    await stock.save()
    log.end()
    return getById(stock.id, context)
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/stocks:search')
    query = {
        'quantity': {
            $gte: query.quantity || 1
        },
        store: context.store,
        organization: context.organization
    }

    const stock = await db.stock.find(query)

    log.end()
    return stock
}

exports.buildStocks = async (data, context) => {
    context.logger.start('services/stocks:buildStocks')

    return new db.stock({
        quantity: data.quantity,
        location: data.location,
        price: data.price,
        leadQuantity: data.leadQuantity,
        organization: context.organization,
        store: context.store.id,
        product: context.product.id,
        batch: context.batch.id
    })
}

const findOneByQuery = async (query, context) => {
    let log = context.logger.start('services/stocks:getByQuery')

    let clause = context.where().clause

    if (query.product) {
        clause.product = query.product
    }

    let stock = await db.stock.findOne(clause).populate('batches')
    log.end()

    return stock
}

exports.update = update
exports.getById = getById
exports.findOneByQuery = findOneByQuery
