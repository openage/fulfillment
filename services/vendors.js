'use strict'
const db = require('../models')

exports.create = async (model, context) => {
    const log = context.logger.start('services/vendors:create')

    model.tenant = context.tenant
    const vendor = await new db.vendor(model).save()

    log.end()
    return vendor
}

exports.get = async (id, context) => {
    const log = context.logger.start('services/vendors:get')

    const vendor = await db.vendor.findById(id)

    log.end()
    return vendor
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/vendors:search')

    const vendors = await db.vendor.find(query)

    log.end()
    return vendors
}
