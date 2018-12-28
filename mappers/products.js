'use strict'

exports.toModel = entity => {
    const model = {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        subBrand: entity.subBrand,
        price: entity.price,
        description: entity.description,
        pic: entity.pic,
        discount: entity.discount,
        taxes: []

    }

    if (entity.taxes && entity.taxes.length) {
        model.taxes = entity.taxes.map((tax) => {
            return {
                id: tax.id,
                type: tax.type,
                value: tax.value
            }
        })
    }
    if (entity.batch) {
        model.batch = entity.batch._doc ? {
            id: entity.batch.id,
            code: entity.batch.code,
            expiry: entity.batch.expiry,
            price: entity.batch.price,
            quantity: entity.batch.quantity
        } : {
            id: entity.batch.toString()
        }
    }
    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name
        } : {
            id: entity.organization.toString()
        }
    }

    if (entity.category) {
        model.category = entity.category._doc ? {
            id: entity.category.id,
            code: entity.category.code,
            name: entity.category.name
        } : {
            id: entity.category.toString()
        }
    }

    if (entity.tenant) {
        model.tenant = entity.tenant._doc ? {
            id: entity.tenant.id,
            code: entity.tenant.code,
            name: entity.tenant.name
        } : {
            id: entity.tenant.toString()
        }
    }

    if (entity.manufacturer) {
        model.manufacturer = entity.manufacturer._doc ? {
            id: entity.manufacturer.id,
            code: entity.manufacturer.code,
            name: entity.manufacturer.name
        } : {
            id: entity.manufacturer.toString()
        }
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
