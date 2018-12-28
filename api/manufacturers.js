'use strict'

const manufacturers = require('../services/manufacturers')
const mapper = require('../mappers/manufacturer')

exports.create = async (req) => {
    const log = req.context.logger.start('api/manufacturer:create')

    const manufacturer = await manufacturers.create(req.body, req.context)

    log.end()

    return mapper.toModel(manufacturer)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/manufacturer:get')

    const manufacturer = await manufacturers.get(req.params.id, req.context)

    log.end()

    return mapper.toModel(manufacturer)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/manufacturer:search')

    const query = {}

    const manufacturerList = await manufacturers.search(query, req.context)

    log.end()

    return mapper.toSearchModel(manufacturerList)
}
