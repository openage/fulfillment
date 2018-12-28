'use strict'

exports.toModel = entity => {
    const model = {
        id: entity.id,
        profile: entity.profile,
        role: entity.role
    }

    if (entity.membership._doc) {
        model.membership = {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name
        }
    } else {
        model.membership = {
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
