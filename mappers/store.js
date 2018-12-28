'use strict'

exports.toModel = entity => {
    const model = {
        id: entity.id,
        name: entity.name,
        shortName: entity.shortName,
        code: entity.code,
        status: entity.status,
        about: entity.about,
        contacts: entity.contacts
    }

    if (entity.organization && entity.organization._doc) {
        model.name = entity.organization.name
        model.shortName = entity.organization.shortName
    }

    if (entity.address) {
        model.address = {
            line1: entity.address.line1,
            line2: entity.address.line2,
            district: entity.address.district,
            city: entity.address.city,
            state: entity.address.state,
            pinCode: entity.address.pinCode,
            country: entity.address.country
        }
    }

    if (entity.rating) {
        model.rating = {
            value: entity.rating.value,
            rate: entity.rating.value,
            rateCount: entity.rating.rateCount,
            reviewCount: entity.rating.reviewCount,
            oneStar: entity.rating.oneStar,
            twoStar: entity.rating.twoStar,
            threeStar: entity.rating.threeStar,
            fourStar: entity.rating.fourStar,
            fiveStar: entity.rating.fiveStar
        }
    }

    if (entity.location) {
        model.location = {
            coordinates: entity.location.coordinates,
            description: entity.location.description,
            name: entity.location.name,
            distance: entity.location.distance,
            duration: entity.location.duration
        }
    }

    if (entity.organization) {
        model.organization =
            (entity.organization._doc) ? {
                id: entity.organization.id,
                code: entity.organization.code,
                name: entity.organization.name,
                shortName: entity.organization.shortName
            } : {
                id: entity.organization.toString()
            }
    }
    if (entity.tenant) {
        model.tenant =
            (entity.tenant._doc) ? {
                id: entity.tenant.id,
                code: entity.tenant.code
            } : {
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
