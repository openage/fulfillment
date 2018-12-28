'use strict'

const orderService = require('../services/orders')
const storeService = require('../services/stores')
const mapper = require('../mappers/order')
const db = require('../models')



exports.create = async (req) => {
    const log = req.context.logger.start('api/order:create')

    if (req.body.store) {
        let store = await storeService.get(req.body.store, req.context)
        if (!store) {
            throw new Error('store not found')
        }
        req.context.store = store
        req.context.organization = store.organization
        req.body.store = store.id
    }

    const order = await orderService.create(req.body, req.context)

    log.end()

    return mapper.toModel(order)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/order:search')
    const query = {}

    if (req.query.status) {
        query.status = req.query.status
    }

    let orderList
    if (req.context.employee) {
        query.employee = req.context.employee.id
        orderList = await db.order.find(query).populate('customer employee')
    } else {
        orderList = await db.order.aggregate([{
            $match: query
        }, {
            $lookup: {
                from: 'customers',
                localField: 'customer',
                foreignField: '_id',
                as: 'customer'
            }
        }, {
            $unwind: '$customer'
        }, {
            $match: {
                'customer.user': toObjectId(req.context.user.id)
            }
        }])
    }

    log.end()

    return mapper.toSearchModel(orderList)
}

exports.update = async (req) => {
    const log = req.context.logger.start('api/order:update')

    const order = await orderService.update(req.body, req.params.id, req.context)

    log.end()
    return mapper.toModel(order)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/order:get')

    const order = await orderService.getById(req.params.id, req.context)

    log.end()
    return mapper.toModel(order)
}
