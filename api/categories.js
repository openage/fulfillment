'use strict'

const categories = require('../services/categories')
const mapper = require('../mappers/categories')

exports.create = async (req) => {
    const log = req.context.logger.start('api/categories:create')
let model = req.body
    const category = await categories.create(model, req.context)

    log.end()

    return mapper.toModel(category)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/categories:get')

    const category = await categories.getById(req.params.id, req.context)

    log.end()

    return mapper.toModel(category)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/categories:search')

    const query = {}

    const categoryList = await categories.search(query, req.context)

    log.end()

    return mapper.toSearchModel(categoryList)
}
