'use strict'
const customerMapper = require('./customer')
const userMapper = require('./user')
const organizationMapper = require('./organization')
const productMapper = require('./product')
const storeMapper = require('./store')
const posMapper = require('./pos')
const pic = require('./pic')

// const extractLocation = (entities) => {
//     let location = []
//     if (!entities || !entities.length) {
//         return location
//     }

//     location = entities.map(entity => {
//         return {
//             coordinates: entity.coordinates,
//             name: entity.name
//         }
//     })
//     return location
// }

exports.toModel = (entity, context) => {
    if (!entity) {
        return
    }

    if (entity._bsontype === 'ObjectID') {
        return {
            id: entity.toString()
        }
    }

    const model = {
        id: entity.id,
        code: entity.code,
        status: entity.status,
        customer: customerMapper.toModel(entity.customer, context),
        user: userMapper.toModel(entity.user, context),
        pos: posMapper.toModel(entity.pos, context),
        store: storeMapper.toModel(entity.store, context),
        organization: organizationMapper.toModel(entity.organization, context)
    }

    if (entity.invoice) {
        model.invoice = {
            id: entity.invoice.id,
            code: entity.invoice.code,
            pic: pic.toModel(entity.invoice.pic, context),
            amount: entity.invoice.amount,
            discount: entity.invoice.discount ? { type: entity.invoice.discount.type, value: entity.invoice.discount.value } : {},
            taxes: entity.invoice.taxes ? entity.invoice.taxes.map(t => { return { type: t.type, value: t.value } }) : []
        }
    }

    if (entity.payments && entity.payments.length) {
        model.payments = entity.payments.map(payment => {
            return {
                id: payment.id,
                code: payment.code,
                mode: payment.mode,
                amount: payment.amount
            }
        })
    }

    if (entity.products && entity.products.length) {
        model.products = entity.products.map(item => {
            return {
                product: productMapper.toModel(item.product, context),
                amount: item.amount,
                quantity: item.quantity,
                discount: item.discount ? { type: item.discount.type, value: item.discount.value } : {},
                taxes: item.taxes ? item.taxes.map(t => { return { type: t.type, value: t.value } }) : []
            }
        })
    }

    return model
}
