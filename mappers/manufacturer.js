'use strict'
const pic = require('./pic')

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
        description: entity.description,
        pic: pic.toModel(entity.pic, context)

    }
}
