'use strict'

const db = require('../models')
const manufacturerService = require('../services/manufacturers')
const categoryService = require('../services/categories')
const batchesService = require('../services/batches')
const offline = require('@open-age/offline-processor')

const getByCode = async (code, context) => {
    let log = context.logger.start('services/products:getByCode')

    let clause = context.where().add('code', code).clause

    let product = await db.product.findOne(clause)

    log.end()
    return product
}

const create = async (model, context) => {
    const log = context.logger.start('services/products:create')

    let manufacturer
    if (model.manufacturer) {
        manufacturer = await manufacturerService.get(model.manufacturer, context)
    }

    let category
    if (model.category) {
        category = await categoryService.get(model.category, context)
    } else {
        category = await db.category.findOne({code: 'noCategory'})
    }
    let batch
    if (model.batch) {
        batch = await batchesService.get(model.batch, context)
    }
    const product = await new db.product({
        code: model.code,
        name: model.name,
        price: model.price,
        batch: batch,
        manufacturer: manufacturer,
        category: category,
        organization: context.organization,
        tenant: context.tenant
    }).save()

    await offline.queue('product', 'create', {
        id: product.id
    }, context)

    log.end()
    return product
}

exports.getById = async (id, context) => {
    const log = context.logger.start('services/products:getById')

    const product = await db.product.findById(id).populate('manufacturer', 'organization', 'tenant', 'category')

    log.end()
    return product
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/products:search')

    const products = await db.product.find(query).populate('organization tenant')

    log.end()
    return products
}

exports.get = async (query, context) => {
    let log = context.logger.start('services/product:get')
    let product = null
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            product = await db.product.findById(query)
        } else {
            if (context.organization) {
                product = await db.product.findOne({
                    code: query,
                    organization: context.organization
                })

                if (!product) {
                    product = await create(query, context)
                }
            }
        }
    } else if (query._doc) {
        product = query
    } else if (query.id) {
        product = await db.product.findById(query.id)
    } else if (query.code && context.organization) {
        product = await db.product.findOne({
            code: query.code,
            organization: context.organization
        })
    }

    if (!product) {
        product = await create(query, context)
    }
    log.end()
    return product
}

exports.create = create
exports.getByCode = getByCode
