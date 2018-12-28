'use strict'

exports.toModel = entity => {
    const model = {
        id: entity.id,
        name: entity.name,
        code: entity.code
    }

    if (entity.organization._doc) {
        model.organization = {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name
        }
    } else {
        model.organization = {
            id: entity.organization.toString()
        }
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
