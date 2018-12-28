'use strict'
const db = require('../models')
const storeService = require('../services/stores')
const mapper = require('../mappers/store')
const paging = require('../helpers/paging')

exports.create = async (req) => {
    const log = req.context.logger.start('api/stores:create')

    const store = await storeService.create(req.body, req.context)

    log.end()
    return mapper.toModel(store)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/stores:get')

    const store = await storeService.getById(req.params.id, req.context)

    log.end()
    return mapper.toModel(store)
}

exports.update = async (req) => {
    const log = req.context.logger.start('api/stores:update')

    const store = await storeService.update(req.body, req.params.id, req.context)

    log.end()
    return mapper.toModel(store)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/stores:search')

    let query = {}
    let sortQuery = {}

    const nearby = !!(req.query.nearby === 'true' || req.query.nearby)

    if (!nearby) {
        sortQuery['rating.rate'] = -1
    }

    if (req.query.cityName) {
        query['$or'] = [{
            'address.city': {
                $regex: `^${req.query.cityName}$`,
                $options: 'i'
            }
        }, {
            'address.district': {
                $regex: `^${req.query.cityName}$`,
                $options: 'i'
            }
        }]
    }

    if (nearby) {
        query['location.coordinates'] = {
            $nearSphere: {
                $geometry: {
                    type: 'Point',
                    coordinates: [
                        req.query.longitude,
                        req.query.latitude
                    ]
                },
                $minDistance: req.query.minDistance || 0, // values in meters
                $maxDistance: req.query.maxDistance || 100000
            }
        }
    }

    if (req.context.organization) {
        query['organization'] = req.context.organization
    }
    let where = db.store.find(query).sort(sortQuery).populate('organization')

    let pageInput = paging.extract(req)

    let storeList = await (pageInput ? where.skip(pageInput.skip).limit(pageInput.limit) : where)

    let page = {
        items: mapper.toSearchModel(storeList)
    }

    if (pageInput) {
        page.total = await where.count()
        page.pageNo = pageInput.pageNo
        page.pageSize = pageInput.limit
    }

    log.end()
    return page
}
