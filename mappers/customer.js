'use strict'

const userMapper = require('./user')
const organizationMapper = require('./organization')

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
        discount: {
            value: entity.discount.value,
            type: entity.discount.type
        },
        user: userMapper.toModel(entity.user, context),
        organization: organizationMapper.toModel(entity.organization, context)
    }
}
