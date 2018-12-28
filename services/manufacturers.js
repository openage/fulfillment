'use strict'
const db = require('../models')

const create = async (model, context) => {
    const log = context.logger.start('services/manufacturer:create')
    model.tenant = context.tenant
    const manufacturer = await new db.manufacturer(model).save()

    log.end()
    return manufacturer
}

// exports.get = async (id, context) => {
//     const log = context.logger.start('services/manufacturer:get')

//     const manufacturer = await db.manufacturer.findById(id)

//     log.end()
//     return manufacturer
// }

exports.search = async (query, context) => {
    const log = context.logger.start('services/manufacturer:search')

    const manufacturers = await db.manufacturer.find(query).populate('organization tenant')

    log.end()
    return manufacturers
}

exports.get = async (data, context) => {
    context.logger.start('services/manufacturers:get')
    let manufacturer = null
    if (typeof data === 'string') {
        if (data.toObjectId()) {
            manufacturer = await db.manufacturer.findById(data)
        } else {
            manufacturer = await db.manufacturer.findOne({
                code: data,
                tenant: context.tenant.id
            })
        }
    }

    if (data.id) {
        manufacturer = await db.manufacturer.findById(data.id)
    }

    if (data.code) {
        manufacturer = await db.manufacturer.findOne({
            code: data.code,
            tenant: context.tenant.id
        })
    }

    if (!manufacturer) {
        manufacturer = await create(data, context)
    }
    return manufacturer
}

exports.create = create
