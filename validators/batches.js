'use strict'

exports.canCreate = async (req) => {
    const log = req.context.logger.start('canCreate')

    if (!req.body) {
        return 'invalid request'
    }

    if (!req.body.code) {
        return 'code is required'
    }

    if (!req.body.quantity && req.body.quantity !== 0) {
        return 'quantity is required'
    }

    if (!req.body.price && req.body.price !== 0) {
        return 'price is required'
    }

    if (!req.body.expiry) {
        return 'expiry is required'
    }

    if (!req.body.product && !req.body.product.id) {
        return 'product is required'
    } else {
        req.body.product = req.body.product.id     // TODO: obsolete
    }

    log.end()
}

exports.canGet = async (req) => {
    const log = req.context.logger.start('canGet')

    if (!req.params) {
        return 'invalid request'
    }

    if (!req.params.id) {
        return 'id is required'
    }

    log.end()
}

exports.canSearch = async (req) => {
    const log = req.context.logger.start('canSearch')

    log.end()
}
