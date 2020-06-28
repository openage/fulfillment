'use strict'
const db = require('../models')
const storeService = require('./stores')
const userService = require('./products')

const offline = require('@open-age/offline-processor')

const populate = 'user store organization'

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

    if (model.status) {
        entity.status = model.status
    }

    if (model.store) {
        entity.store = await storeService.get(model.store, context)
    }

    if (model.user) {
        entity.user = await userService.get(model.user, context)
    }
}

exports.create = async (model, context) => {
    const log = context.logger.start('services/pos:create')

    const entity = await new db.pos({
        status: 'active',
        organization: context.organization,
        tenant: context.tenant
    })
    await set(model, entity, context)
    await entity.save()

    await offline.queue('pos', 'create', entity, context)

    log.end()
    return entity
}

exports.update = async (id, model, context) => {
    context.logger.debug('services/pos:update')

    let entity = await this.get(id, context)

    await set(model, entity, context)
    await entity.save()

    return entity
}

exports.search = async (query, page, context) => {
    let log = context.logger.start('services/pos:search')
    query = query || {}

    let where = {
        status: 'active',
        organization: context.organization,
        tenant: context.tenant
    }

    if (query.status) {
        where.status = query.status
    }

    const count = await db.pos.find(where).count()
    let items
    if (page) {
        items = await db.pos.find(where).skip(page.skip).limit(page.limit)
    } else {
        items = await db.pos.find(where)
    }

    log.end()

    return {
        count: count,
        items: items
    }
}

exports.get = async (query, context) => {
    context.logger.start('services/pos:get')
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.pos.findById(query).populate(populate)
        } else {
            return db.pos.findOne({
                code: query.toLocaleUpperCase(),
                organization: context.organization
            }).populate(populate)
        }
    }
    if (query._doc) {
        return query
    }
    if (query.id) {
        return db.pos.findById(query.id).populate(populate)
    }
    if (query.code) {
        return db.pos.findOne({
            code: query.code.toLocaleUpperCase(),
            organization: context.organization
        }).populate(populate)
    }
}

exports.remove = async (id, context) => {
    let entity = await this.get(id, context)
    entity.status = 'inactive'
    await entity.save()
}
