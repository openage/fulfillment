'use strict'
const db = require('../models')
const offline = require('@open-age/offline-processor')
const users = require('../services/users')

const populate = 'user organization'

const set = async (model, entity, context) => {
    if (model.discount) {
        entity.discount = {
            value: model.discount.value,
            type: model.discount.type
        }
    }

    if (model.status) {
        entity.status = model.status
    }
}
const create = async (model, context) => {
    let log = context.logger.start('services/customers:create')

    let user = await users.get(model.user, context)

    if (!user) {
        throw new Error('invalid user')
    }

    let entity = new db.customer({
        user: user,
        organization: context.organization,
        tenant: context.tenant
    })

    await set(model, entity, context)

    await entity.save()

    await offline.queue('customer', 'create', entity, context)
    log.end()
    return entity
}

exports.get = async (query, context) => {
    context.logger.start('services/customers:get')

    if (typeof query === 'string') {
        if (query.isObjectId()) {
            return db.customer.findById(query).populate(populate)
        }

        let user = await users.get(query, context)
        if (!user) {
            throw new Error('invalid user')
        }
        return db.customer.findOne({
            user: user,
            organization: context.organization,
            tenant: context.tenant
        }).populate(populate)
    }
    if (query.id) {
        return db.customer.findById(query.id).populate(populate)
    }

    if (query.user) {
        let user = await users.get(query, context)
        if (!user) {
            throw new Error('invalid user')
        }
        return db.customer.findOne({
            user: user,
            organization: context.organization,
            tenant: context.tenant
        }).populate(populate)
    }
}

exports.search = async (query, page, context) => {
    let log = context.logger.start('services/customers:search')
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

    if (query.user) {
        where.user = await users.get(query.user, context)
    }

    const count = await db.customer.find(where).count()
    let items
    if (page) {
        items = await db.customer.find(where).skip(page.skip).limit(page.limit).populate(populate)
    } else {
        items = await db.customer.find(where).populate(populate)
    }

    log.end()

    return {
        count: count,
        items: items
    }
}
