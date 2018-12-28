'use strict'
const db = require('../models')

exports.create = async (model, context) => {
    const log = context.logger.start('services/organization:create')

    const organization = await new db.organization(model).save()
    log.end()

    return organization
}

exports.get = async (id, context) => {
    const log = context.logger.start('services/organization:get')

    const organization = await db.organization.findById(id).populate('tenant')

    log.end()

    return organization
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/organization:search')

    const organizations = await db.organization.find(query).populate('tenant')

    log.end()

    return organizations
}

const getByCode = async (code, context) => {
    const log = context.logger.start('services/organization:getByCode')

    const organization = await db.organization.findOne({ code: code, tenant: context.tenant })

    log.end()

    return organization
}

exports.getOrCreate = async (model, context) => {
    const log = context.logger.start('services/organization:get')
    let organization = await getByCode(model.code, context)

    if (organization) {
        log.end()
        return organization
    }

    var data = {
        code: model.code,
        name: model.name,
        logo: model.logo,
        tenant: context.tenant
    }

    organization = await new db.organization(data).save()
    if (!organization) {
        throw new Error(`could not create the organization`)
    }
    log.end()
    return organization
}
