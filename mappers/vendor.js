'use strict'

exports.toModel = entity => {
    const model = {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        financial: entity.financial
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

    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
