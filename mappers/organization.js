'use strict'

exports.toModel = entity => {
    const model = {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        logo: entity.logo,
        vendors: []
    }

    if (entity.tenant._doc) {
        model.tenant = {
            id: entity.tenant.id,
            code: entity.tenant.code,
            name: entity.tenant.name
        }
    } else {
        model.tenant = {
            id: entity.tenant.toString()
        }
    }

    if (entity.vendors.length) {
        entity.vendors.map((vendor) => {
            model.vendors.push({
                id: vendor.id,
                name: vendor.name,
                code: vendor.code
            })
        })
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
