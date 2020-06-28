'use strict'
const organizationMapper = require('./organization')
const pic = require('./pic')
const address = require('./address')
const categories = require('./category')
const ratings = require('./rating')
const timings = require('./timings')

exports.toModel = (entity, context) => {
    if (!entity) {
        return
    }

    if (entity._bsontype === 'ObjectID') {
        return {
            id: entity.toString()
        }
    }

    return {
        id: entity.id,
        code: entity.code,
        name: entity.name,
        description: entity.description,
        tags: entity.tags,
        shortName: entity.shortName,
        status: entity.status,
        workingStatus: entity.workingStatus,
        pic: pic.toModel(entity.pic, context),
        address: address.toModel(entity.address, context),
        category: categories.toModel(entity.category, context),
        rating: ratings.toModel(entity.rating, context),
        timings: timings.toModel(entity.timings, context),
        organization: organizationMapper.toModel(entity.organization, context)
    }

    // if (entity.location) {
    //     model.location = {
    //         coordinates: entity.location.coordinates,
    //         description: entity.location.description,
    //         name: entity.location.name,
    //         distance: entity.location.distance,
    //         duration: entity.location.duration
    //     }
    // }
}
