'use strict'

const db = require('../models')
const manufacturerService = require('../services/manufacturers')
const categoryService = require('../services/categories')
const offline = require('@open-age/offline-processor')

const populate = 'manufacturer organization tenant category'

const set = async (model, entity, context) => {
    if (model.code && entity.code !== model.code.toLowerCase()) {
        if (await this.get(model.code, context)) {
            throw new Error(`'${model.code}' already exists`)
        }

        entity.code = model.code.toLowerCase()
    }

    if (model.name) {
        entity.name = model.name
    }
    if (model.description) {
        entity.description = model.description
    }

    if (model.pic) {
        let url = model.pic.url || model.pic
        entity.pic = {
            url: url,
            thumbnail: model.pic.thumbnail || url
        }
    }

    if (model.status) {
        entity.status = model.status
    }

    if (model.price) {
        entity.price = model.price
    }

    if (model.category) {
        entity.category = await categoryService.get(model.category, context)
    }
    if (model.manufacturer) {
        entity.manufacturer = await manufacturerService.get(model.manufacturer, context)
    }

    if (model.tags && model.tags[0]) {
        entity.tags = []
        model.tags.forEach(tag => {
            entity.tags.push(tag.toString())
        })
    }
    
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/products:create')
    if (!model.code) {
        throw new Error('code is required')
    }
    if (!model.name) {
        throw new Error('name is required')
    }

    const entity = new db.product({
        status: 'active',
        organization: context.organization,
        tenant: context.tenant
    })

    await set(model, entity, context)
    await entity.save()

    await offline.queue('product', 'create', entity, context)

    log.end()
    return entity
}
exports.update = async (id, model, context) => {
    context.logger.debug('services/products:update')

    let entity = await this.get(id, context)

    await set(model, entity, context)
    await entity.save()

    return entity
}

exports.remove = async (id, context) => {
    let entity = await this.get(id, context)
    entity.status = 'inactive'
    await entity.save()
}

exports.search = async (query, page, context) => {
    let log = context.logger.start('services/products:search')
    query = query || {}

    let where = {
        status: 'active',
        tenant: context.tenant
    }

    if (context.organization) {
        where.organization = context.organization
    }

    if (query.status) {
        where.status = query.status
    }

    if (query.name) {
        where.$or = [{
            name: {
                $regex: '^' + query.name,
                $options: 'i'
            }
        }, {
            code: {
                $regex: '^' + query.name,
                $options: 'i'
            }
        }]
    }

    if (query.tag) {
        where.tags = {
            $regex: '^' + query.tag,
            $options: 'i'
        }
    }

    const count = await db.product.find(where).count()
    let items
    if (page) {
        items = await db.product.find(where).skip(page.skip).limit(page.limit).populate(populate)
    } else {
        items = await db.product.find(where).populate(populate)
    }

    log.end()

    return {
        count: count,
        items: items
    }
}

exports.get = async (query, context) => {
    context.logger.start('services/product:get')
    if(!query){
        return
    }
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.product.findById(query).populate(populate)
        } else {
            return db.product.findOne({
                code: query.toLowerCase(),
                organization: context.organization
            }).populate(populate)
        }
    }
    if (query._doc) {
        return query
    }
    if (query.id) {
        return db.product.findById(query.id).populate(populate)
    }
    if (query.code && context.organization) {
        return db.product.findOne({
            code: query.code.toLowerCase(),
            organization: context.organization
        }).populate(populate)
    }
}
