'use strict'
const db = require('../models')

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
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/categories:create')
    if (!model.code) {
        throw new Error('code is required')
    }
    if (!model.name) {
        throw new Error('name is required')
    }

    let entity = new db.category({
        status: 'active',
        tenant: context.tenant
    })

    await set(model, entity, context)
    await entity.save()

    log.end()

    return entity
}

exports.update = async (id, model, context) => {
    context.logger.debug('services/categories:update')

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
    let log = context.logger.start('services/categories:search')
    query = query || {}

    let where = {
        status: 'active',
        tenant: context.tenant
    }

    if (query.status) {
        where.status = query.status
    }

    if (query.name) {
        where['name'] = {
            $regex: query.name,
            $options: 'i'
        }
    }

    const count = await db.category.find(where).count()
    let items
    if (page) {
        items = await db.category.find(where).skip(page.skip).limit(page.limit)
    } else {
        items = await db.category.find(where)
    }

    log.end()

    return {
        count: count,
        items: items
    }
}

exports.get = async (query, context) => {
    context.logger.start('services/categories:get')
    if (!query) {
        return
    }
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.category.findById(query)
        } else {
            return db.category.findOne({
                code: query.toLowerCase(),
                tenant: context.tenant
            })
        }
    }
    if (query.id) {
        return db.category.findById(query.id)
    }

    if (query.code) {
        return db.category.findOne({
            code: query.code.toLowerCase(),
            tenant: context.tenant
        })
    }
}
