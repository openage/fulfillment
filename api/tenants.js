'use strict'

const tenants = require('../services/tenants')
const mapper = require('../mappers/tenants')

exports.create = async (req) => {
    const log = req.context.logger.start('api/tenants:create')

    const tenant = await tenants.create(req.body, req.context)

    log.end()

    return mapper.toModel(tenant)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/tenants:get')

    const tenant = await tenants.get(req.params.id, req.context)

    log.end()

    return mapper.toModel(tenant)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/tenants:search')

    const query = {}

    const tenantList = await tenants.search(query, req.context)

    log.end()

    return mapper.toSearchModel(tenantList)
}
