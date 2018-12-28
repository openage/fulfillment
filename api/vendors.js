'use strict'

const vendors = require('../services/vendors')
const mapper = require('../mappers/vendor')

exports.create = async (req) => {
    const log = req.context.logger.start('api/vendor:create')

    const vendor = await vendors.create(req.body, req.context)

    log.end()

    return mapper.toModel(vendor)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/vendor:get')

    const vendor = await vendors.get(req.params.id, req.context)

    log.end()

    return mapper.toModel(vendor)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/vendor:search')

    const query = {}

    const vendorList = await vendors.search(query, req.context)

    log.end()

    return mapper.toSearchModel(vendorList)
}
