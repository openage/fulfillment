'use strict'

const productService = require('../services/products')
const mapper = require('../mappers/products')

exports.create = async (req) => {
    const log = req.context.logger.start('api/products:create')
    let model = req.body
    const product = await productService.create(model, req.context)

    log.end()
    return mapper.toModel(product)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/products:get')

    const product = await productService.getById(req.params.id, req.context)

    log.end()
    return mapper.toModel(product)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/products:search')
    let query = {}

    if (req.query.name) {
        query.$or = [{
            name: {
                $regex: '^' + req.query.name,
                $options: 'i'
            }
        }, {
            code: {
                $regex: '^' + req.query.name,
                $options: 'i'
            }
        }]
    }

    if (req.context.organization) {
        query['organization'] = req.context.organization
    }

    const productList = await productService.search(query, req.context)

    log.end()

    return mapper.toSearchModel(productList)
}
