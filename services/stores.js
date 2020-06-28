'use strict'
const db = require('../models')
const offline = require('@open-age/offline-processor')
const categories = require('./categories')
const populate = 'organization'

const set = async (model, entity, context) => {
    if (model.code && entity.code !== model.code.toLowerCase()) {
        if (await this.get({ code: model.code }, context)) {
            throw new Error(`'${model.code}' already exists`)
        }

        entity.code = model.code.toLowerCase()
    }

    if (model.name) {
        entity.name = model.name
    }
    if (model.description) {
        entity.description = model.description
    }

    if (model.pic) {
        let url = model.pic.url || model.pic
        entity.pic = {
            url: url,
            thumbnail: model.pic.thumbnail || url
        }
    }

    if (model.status) {
        entity.status = model.status
    }

    if (model.workingStatus) {
        entity.workingStatus = model.workingStatus
    }

    if (model.timings) {
        entity.timings = model.timings || {}

        if (model.timings.opening) {
            entity.timings.opening = model.timings.opening
        }

        if (model.timings.closing) {
            entity.timings.closing = model.timings.closing
        }

        if (model.timings.lunchStart) {
            entity.timings.lunchStart = model.timings.lunchStart
        }

        if (model.timings.lunchEnd) {
            entity.timings.lunchEnd = model.timings.lunchEnd
        }

        if (model.timings.teaStart) {
            entity.timings.teaStart = model.timings.teaStart
        }

        if (model.timings.teaEnd) {
            entity.timings.teaEnd = model.timings.teaEnd
        }
    }

    if (model.address) {
        entity.address = model.address || {}

        if (model.address.line1) {
            entity.address.line1 = model.address.line1
        }

        if (model.address.line2) {
            entity.address.line2 = model.address.line2
        }

        if (model.address.pinCode) {
            entity.address.pinCode = model.address.pinCode
        }

        if (model.address.city) {
            entity.address.city = model.address.city
        }

        if (model.address.district) {
            entity.address.district = model.address.district
        }

        if (model.address.state) {
            entity.address.state = model.address.state
        }

        if (model.address.country) {
            entity.address.country = model.address.country
        }

        if (model.address.lat) {
            entity.address.lat = model.address.lat
        }

        if (model.address.long) {
            entity.address.long = model.address.long
        }
    }

    if (model.category) {
        entity.category = await categories.get(model.category, context)
        if (!entity.category) {
            entity.category = await categories.create(model.category, context)
        }
    }

    if (model.tags && model.tags[0]) {
        entity.tags = []
        model.tags.forEach(tag => {
            entity.tags.push(tag.toString())
        })
    }

}

exports.create = async (model, context) => {
    const log = context.logger.start('services/stores:create')
    if (!model.code) {
        throw new Error('code is required')
    }
    if (!model.name) {
        throw new Error('name is required')
    }

    const entity = new db.store({
        status: 'active',
        organization: context.organization,
        tenant: context.tenant
    })

    await set(model, entity, context)
    await entity.save()

    await offline.queue('store', 'create', entity, context)

    log.end()
    return entity
}

exports.update = async (id, model, context) => {
    context.logger.debug('services/stores:update')

    let entity = await this.get(id, context)

    await set(model, entity, context)
    await entity.save()

    await offline.queue('store', 'update', entity, context)

    return entity
}

exports.remove = async (id, context) => {
    let entity = await this.get(id, context)
    entity.status = 'inactive'
    await entity.save()
}

exports.get = async (query, context) => {
    context.logger.start('services/stores:get')
    if (!query) {
        return
    }
    if (typeof query === 'string') {
        if (query.toObjectId()) {
            return db.store.findById(query).populate(populate)
        } else {
            return db.store.findOne({
                code: query.toLowerCase(),
                organization: context.organization
            }).populate(populate)
        }
    }
    if (query.id) {
        return db.store.findById(query.id).populate(populate)
    }
    if (query.code) {
        return db.store.findOne({
            code: query.code.toLowerCase,
            organization: context.organization
        }).populate(populate)
    }
}

exports.search = async (query, page, context) => {
    const log = context.logger.start('services/stores:search')

    let where = {
        tenant: context.tenant
    }
    let sortQuery = {}

    // const nearby = !!(req.query.nearby === 'true' || req.query.nearby)

    // if (!nearby) {
    //     sortQuery['rating.rate'] = -1
    // }

    // if (req.query.cityName) {
    //     query['$or'] = [{
    //         'address.city': {
    //             $regex: `^${req.query.cityName}$`,
    //             $options: 'i'
    //         }
    //     }, {
    //         'address.district': {
    //             $regex: `^${req.query.cityName}$`,
    //             $options: 'i'
    //         }
    //     }]
    // }

    // if (nearby) {
    //     query['location.coordinates'] = {
    //         $nearSphere: {
    //             $geometry: {
    //                 type: 'Point',
    //                 coordinates: [
    //                     req.query.longitude,
    //                     req.query.latitude
    //                 ]
    //             },
    //             $minDistance: req.query.minDistance || 0, // values in meters
    //             $maxDistance: req.query.maxDistance || 100000
    //         }
    //     }
    // }

    if (context.organization) {
        where.organization = context.organization
    }
    
    if (query.tag) {
        where.tags = {
            $regex: '^' + query.tag,
            $options: 'i'
        }
    }

    const count = await db.store.find(where).count()
    let items
    if (page) {
        items = await db.store.find(where).skip(page.skip).limit(page.limit).populate(populate)
    } else {
        items = await db.store.find(where).populate(populate)
    }

    log.end()

    return {
        count: count,
        items: items
    }
}
