'use strict'

const batches = require('../services/batches')
const mapper = require('../mappers/batch')
// const product = require('../services/products')

exports.create = async (req) => {
    const log = req.context.logger.start('api/batches:create')

    const batch = await batches.create(req.body, req.context)

    log.end()
    return mapper.toModel(batch)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/batches:get')

    const batch = await batches.getById(req.params.id, req.context)

    log.end()
    return mapper.toModel(batch)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/batches:search')

    const batchList = await batches.search(req.query, req.context)

    log.end()
    return mapper.toSearchModel(batchList)
}
