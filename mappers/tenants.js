'use strict'

exports.toModel = entity => {
    const model = {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        logo: entity.logo
    }

    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
