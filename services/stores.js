'use strict'
const db = require('../models')
const offline = require('@open-age/offline-processor')

const set = (model, entity, context) => {
    if (model.status) {
        entity.status = model.status
    }

    if (model.location) {
        entity.location = model.location
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
    }

    if (model.rating) {
        entity.rating = model.rating || {}

        if (model.rating.value) {
            entity.rating.value = model.rating.value
        }

        if (model.rating.rateCount) {
            entity.rating.rateCount = model.rating.rateCount
        }

        if (model.rating.reviewCount) {
            entity.rating.reviewCount = model.rating.reviewCount
        }

        if (model.rating.oneStar) {
            entity.rating.oneStar = model.rating.oneStar
        }

        if (model.rating.twoStar) {
            entity.rating.twoStar = model.rating.twoStar
        }

        if (model.rating.threeStar) {
            entity.rating.threeStar = model.rating.threeStar
        }

        if (model.rating.fourStar) {
            entity.rating.fourStar = model.rating.fourStar
        }

        if (model.rating.fiveStar) {
            entity.rating.fiveStar = model.rating.fiveStar
        }
    }

    if (model.contacts) {
        entity.contacts = model.contacts
    }
}

const create = async (model, context) => {
    const log = context.logger.start('services/stores:create')
    let code
    if (model.code) {
        code = model.code
    } else {
        code = await db.store.find({ organization: (context.organization).id }).count() + 1
    }
    const store = await new db.store({
        location: model.location,
        code: code,
        address: model.address,
        tenant: (context.tenant).id,
        organization: (context.organization).id
    }).save()

    context.processSync = true
    offline.queue('entity', 'create', {
        id: store.id
    }, context)

    log.end()
    return store
}

const getById = async (id, context) => {
    const log = context.logger.start('services/stores:getById')

    const store = await db.store.findById(id).populate('organization')

    log.end()
    return store
}

exports.update = async (model, id, context) => {
    const log = context.logger.start('services/stores:update')

    const store = await db.store.findById(id)

    set(model, store, context)

    await store.save()
    log.end()
    return getById(store.id, context)
}
const get = async (query, context) => {
    let log = context.logger.start('services/stores:get')
    let store
    if (typeof query === 'string') {
        if (query.toObjectId()) {
            store = await db.store.findById(query)
        } else {
            store = await db.store.findOne({
                code: query,
                organization: context.organization
            })
            if (!store) {
                store = await create({
                    code: query.code,
                    organization: context.organization.id || context.organization.toString()
                }, context)
            }
        }
    } else if (query.id) {
        store = await db.store.findById(query.id).populate('organization')
    } else if (query.code) {
        store = await db.store.findOne({
            code: query.code,
            organization: context.organization
        }).populate('organization')
    } else if (context.store.code) {
        store = await db.store.findOne({
            code: context.store.code,
            organization: context.organization
        }).populate('organization')
    }

    if (!store) {
        store = await create({
            code: query.code,
            organization: context.organization.id || context.organization.toString()
        }, context).populate('organization')
    }
    log.end()
    return store ? store.populate('organization') : null
}

exports.create = create
exports.getById = getById
exports.get = get
