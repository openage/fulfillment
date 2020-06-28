'use strict'
const pic = require('./pic')

exports.toModel = (entity, context) => {
    if (!entity) {
        return {}
    }
    return {
        firstName: entity.firstName,
        lastName: entity.lastName,
        dob: entity.dob,
        gender: entity.gender,
        pic: pic.toModel(entity.pic, context)
    }
}
