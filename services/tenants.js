'use strict'

const db = require('../models')

exports.create = async (model, context) => {
    const log = context.logger.start('services/tenant:create')

    // if(tenant.owner)
    const tenant = await new db.tenant(model).save()

    log.end()
    return tenant
}

exports.get = async (id, context) => {
    const log = context.logger.start('services/tenant:get')

    const tenant = await db.tenant.findById(id)

    log.end()
    return tenant
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/tenant:search')

    const tenants = await db.tenant.find(query)

    log.end()
    return tenants
}

const getByCode = async (code, context) => {
    const log = context.logger.start('services/tenant:getByCode')

    const tenant = await db.tenant.findOne({ code: code })

    log.end()

    return tenant
}

exports.getOrCreate = async (model, context) => {
    const log = context.logger.start('services/tenant:getOrCreate')
    let tenant = await getByCode(model.code, context)

    if (tenant) {
        log.end()
        return tenant
    }

    var data = {
        code: model.code,
        name: model.name,
        logo: model.logo
    }

    tenant = await new db.tenant(data).save()
    if (!tenant) {
        throw new Error(`could not create the tenant`)
    }
    log.end()
    return tenant
}
