'use strict'

const pic = require('./pic')
const manufacturerMapper = require('./manufacturer')
const organizationMapper = require('./organization')
const categoryMapper = require('./category')

exports.toModel = (entity, context) => {
    if (!entity) {
        return
    }

    if (entity._bsontype === 'ObjectID') {
        return {
            id: entity.toString()
        }
    }
    return {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        description: entity.description,
        brand: entity.brand,
        price: entity.price,
        pic: pic.toModel(entity.pic, context),
        discount: entity.discount,
        taxes: [],
        tags: entity.tags,
        status: entity.status,
        category: categoryMapper.toModel(entity.category, context),
        manufacturer: manufacturerMapper.toModel(entity.manufacturer, context),
        organization: organizationMapper.toModel(entity.organization, context)
    }

    // if (entity.taxes && entity.taxes.length) {
    //     model.taxes = entity.taxes.map((tax) => {
    //         return {
    //             id: tax.id,
    //             type: tax.type,
    //             value: tax.value
    //         }
    //     })
    // }
    // if (entity.batch) {
    //     model.batch = entity.batch._doc ? {
    //         id: entity.batch.id,
    //         code: entity.batch.code,
    //         expiry: entity.batch.expiry,
    //         price: entity.batch.price,
    //         quantity: entity.batch.quantity
    //     } : {
    //             id: entity.batch.toString()
    //         }
    // }
}
