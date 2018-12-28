'use strict'

const customers = require('../services/customers')
const mapper = require('../mappers/customers')

exports.create = async (req) => {
    const log = req.context.logger.start('api/customers:create')

    const customer = await customers.create(req.body, req.context)

    log.end()

    return mapper.toModel(customer)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/customers:get')

    const product = await customers.get(req.params.id, req.context)

    log.end()

    return mapper.toModel(product)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/customers:search')

    const query = {}

    const productList = await customers.search(query, req.context)

    log.end()

    return mapper.toSearchModel(productList)
}
