'use strict'

const extractProfile = (entity) => {
    if (!entity) {
        return null
    }
    let profile = {
        firstName: entity.firstName,
        lastName: entity.lastName,
        dob: entity.dob,
        gender: entity.gender
    }

    if (entity.pic) {
        profile.pic = {
            url: entity.pic.url,
            thumbnail: entity.pic.thumbnail
        }
    }

    return profile
}

exports.toModel = entity => {
    const model = {
        id: entity.id,
        profile: extractProfile(entity.profile)
    }

    // if (entity.role) {
    //     model.role = {
    //         id: entity.role.id,
    //         code: entity.role.code
    //     }
    // }

    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name
        } : {
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
