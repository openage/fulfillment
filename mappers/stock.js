'use strict'
// const extractProduct = (entity) => {
//     if (!entity) {
//         return {}
//     }
//     return entity._doc ? {
//         id: entity.id,
//         name: entity.name,
//         code: entity.code
//     } : {
//         id: entity.toString()
//     }
// }

const extractBatch = (entity) => {
    if (!entity) {
        return {}
    }
    return entity._doc ? {
        id: entity.id,
        quantity: entity.quantity,
        code: entity.code
    } : {
        id: entity.toString()
    }
}

const extractLocation = (entities) => {
    let location = []
    if (!entities || !entities.length) {
        return location
    }

    location = entities.map(entity => {
        return {
            coordinates: entity.coordinates,
            description: entity.description,
            distance: entity.distance

        }
    })
    return location
}
exports.toModel = entity => {
    const model = {
        // id: entity.id,
        quantity: entity.quantity,
        position: entity.position,
        price: entity.price,
        leadQuantity: entity.leadQuantity

    }

    if (entity.product && entity.product.length) {
        model.product = entity.product.map(item => {
            return {
                id: entity.id,
                name: entity.name,
                code: entity.code,
                batch: extractBatch(item.batch),
                amount: item.amount
            }
        })
    }

    if (entity.product) {
        model.product = entity.product._doc ? {
            id: entity.product.id,
            code: entity.product.code,
            name: entity.product.name,
            position: entity.product.position,
            pic: entity.product.pic,
            batch: extractBatch(entity.product.batch),
            location: extractLocation(entity.product.location)

        } : {
            id: entity.store.toString()
        }
    }
    if (entity.batches && entity.batches.length) {
        model.batches = entity.batches.map(item => {
            return {
                batch: extractBatch(item.batch)

            }
        })
    }

    if (entity.location && entity.location.length) {
        model.location = entity.location.map(item => {
            return {
                location: extractLocation(item.location)
            }
        })
    }
    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name,
            shortName: entity.organization.shortName
        } : {
            id: entity.organization.toString()
        }
    }

    if (entity.store) {
        model.store = entity.store._doc ? {
            id: entity.store.id,
            code: entity.store.code,
            name: entity.store.name,
            shortName: entity.store.shortName,
            pic: entity.store.pic,
            location: extractLocation(entity.store.location)

        } : {
            id: entity.store.toString()
        }
    }
    return model
}
exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
