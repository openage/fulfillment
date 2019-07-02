'use strict'
const db = require('./../../../../models')
const ratingProvider = require('./../../../../providers/rating')

exports.process = async (data, context) => {
    let log = context.logger.start('processors/entity/create:default')

    if (!data.id) { return }

    let store = await db.store.findById(data.id)

    if (!store) { return }

    return ratingProvider.createEntity({
        entityId: store.id,
        entityType: 'store',
        role: context.role
    }, context).then((data) => {
        log.info('entity successfully created')
    }).catch((err) => {
        log.error(err)
    })
}
