'use strict'

const organizationMapper = require('./organization')
const storeMapper = require('./store')
const productMapper = require('./product')

exports.toModel = (entity, context) => {
    if (!entity) {
        return
    }

    if (entity._bsontype === 'ObjectID') {
        return {
            id: entity.toString()
        }
    }
    const model = {
        id: entity.id,
        price: entity.price,
        quantity: entity.quantity,
        product: productMapper.toModel(entity.product, context),
        position: entity.position,
        store: storeMapper.toModel(entity.store, context),
        organization: organizationMapper.toModel(entity.organization, context),
        leadQuantity: entity.leadQuantity
    }

    if (entity.batches && entity.batches.length) {
        model.batches = entity.batches.map(item => {
            return {
                date: item.date,
                expiry: item.expiry,
                price: item.price,
                quantity: item.quantity,
                unit: item.unit
            }
        })
    }

    return model
}
