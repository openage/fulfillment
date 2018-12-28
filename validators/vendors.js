'use strict'

exports.canCreate = async (req) => {
    const log = req.context.logger.start('canCreate')

    if (!req.body) {
        return 'invalid request'
    }

    if (!req.body.code) {
        return 'code is required'
    }

    log.end()
}

exports.canGet = async (req) => {
    const log = req.context.logger.start('canGet')

    if (!req.params) {
        return 'invalid request'
    }
    if (!req.params.id) {
        return 'id s required'
    }

    log.end()
}

exports.canSearch = async (req) => {
    const log = req.context.logger.start('canSearch')

    log.end()
}
