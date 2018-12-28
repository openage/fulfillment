'use strict'

const organizations = require('../services/organizations')
const mapper = require('../mappers/organization')

exports.create = async (req) => {
    const log = req.context.logger.start('api/organization:create')

    const organization = await organizations.create(req.body, req.context)

    log.end()

    return mapper.toModel(organization)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/organization:get')

    const organization = await organizations.get(req.params.id, req.context)

    log.end()

    return mapper.toModel(organization)
}

exports.search = async (req) => {
    let log = req.context.logger.start('api/organization:search')

    const query = {}

    const organization = await organizations.search(query, req.context)

    log.end()

    return mapper.toSearchModel(organization)
}
