'use strict'

const organizationMapper = require('./organization')
const storeMapper = require('./store')
const userMapper = require('./user')

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
        store: storeMapper.toModel(entity.store, context),
        user: userMapper.toModel(entity.user, context),
        organization: organizationMapper.toModel(entity.organization, context)
    }
}
