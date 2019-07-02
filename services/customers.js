'use strict'
const db = require('../models')
// const offline = require('@open-age/offline-processor')
const users = require('../services/users')

const create = async (model, context) => {
    let log = context.logger.start('services/customers:create')

    model.user = await users.get({ role: model.role }, context)

    if (!model.user) {
        throw new Error('invalid user')
    }

    let customer = await new db.customer({
        profile: model.profile,
        user: model.user,
        tenant: context.tenant,
        organization: context.organization
    }).save()

    // offline.queue('customer', 'create', {id: customer.id}, context)
    log.end()
    return customer
}

const getCustomerByRole = async (role, context) => {
    let user = await users.get({ role: role }, context)
    db.customer.findOne({
        user: user,
        organization: context.organization,
        tenant: context.tenant
    }, (err, customer) => {
        if (err) {
            throw new Error(err)
        }
        return customer
    })
}

const get = async (query, context) => {
    const log = context.logger.start('services/customers:get')

    let customer = null
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            customer = await db.customer.findById(query).populate('user')
        }
        customer = await getCustomerByRole({ key: query }, context) // todo
    } else if (query.id) {
        customer = await db.customer.findById(query.id).populate('user')
    } else if (query.role) {
        customer = await getCustomerByRole(query.role, context)
    }

    log.end()
    return customer
}

const getOrCreate = async (data, context) => {
    let log = context.logger.start('services/customers:getOrCreate')
    let customer
    customer = await get(data, context)
    if (!customer) {
        customer = await create(data, context)
    }
    log.end()
    return customer
}

exports.search = async (query, context) => {
    context.logger.start('services/customers:search')

    return db.customer.find(query)
}

const getById = async (id, context) => {
    context.logger.start('services/customers:getById')

    if (!id) {
        throw new Error('id not found')
    }

    return db.customer.findById(id).populate('user')
}

exports.getOrCreate = getOrCreate
exports.get = get
exports.create = create
exports.getById = getById
