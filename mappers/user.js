'use strict'
const profile = require('./profile')

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
        phone: entity.phone,
        email: entity.email,
        status: entity.status,
        profile: profile.toModel(entity.profile, context),
        recentLogin: entity.recentLogin
    }
}
