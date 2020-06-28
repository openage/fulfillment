'use strict'

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
        code: entity.code,
        date: entity.date,
        expiry: entity.expiry,
        price: entity.price,
        quantity: entity.quantity
    }
    if (entity.product) {
        model.product = entity.product._doc ? {
            id: entity.product.id,
            code: entity.product.code,
            name: entity.product.name
        } : {
                id: entity.product.toString()
            }
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
