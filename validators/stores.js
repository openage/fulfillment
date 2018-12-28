'use strict'

exports.canCreate = async (req) => {
    if (!req.body) {
        return 'invalid request'
    }

    if (!req.context.organization) {
        return 'invalid role-key to create store'
    }

    if (!req.body.address) {
        return 'address required'
    }
}

exports.canGet = async (req) => {
    if (!req.params) {
        return 'invalid request'
    }

    if (!req.params.id) {
        return 'id s required'
    }
}

exports.canSearch = async (req) => {
    const nearby = !!(req.query.nearby === 'true' || req.query.nearby)

    if (nearby && !(req.query.latitude && req.query.longitude)) {
        return 'update your location'
    }
}
