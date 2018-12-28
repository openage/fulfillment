'use strict'
const db = require('../models')

const getByCode = async (code, context) => {
    context.logger.start('services/categories:getByCode')

    let clause = context.where().add('code', code).clause

    const category = await db.category.find(clause).populate('organization tenant')
    return category
}

const create = async (model, context) => {
    const log = context.logger.start('services/categories:create')
    let category

    // category = await getByCode(model.code, context)
    // if (category) {
    //     throw new Error(`category ${model.code} already exists`)
    // }

    model.organization = context.organization
    model.tenant = context.tenant
    category = await new db.category(model).save()

    log.end()
    return category
}

exports.getById = async (id, context) => {
    const log = context.logger.start('services/categories:get')

    const category = await db.category.findById(id).populate('organization tenant')

    log.end()
    return category
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/categories:search')

    const categories = await db.category.find(query).populate('organization tenant')

    log.end()

    return categories
}

exports.get = async (data, context) => {
    context.logger.start('services/categories:get')
    let category
    if (typeof data === 'string') {
        if (data.isObjectId()) {
            category = await db.category.findById(data)
        } else {
            category = await getByCode(data, context)
        }
    }

    if (data.id) {
        category = await db.category.findById(data.id)
    }

    if (data.code) {
        category = await getByCode(data.code, context)
    }

    if (!category) {
        category = await create(data, context)
    }
    return category
}

exports.getByCode = getByCode
exports.create = create
