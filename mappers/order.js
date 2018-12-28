'use strict'
const profileMapper = require('./profile')
const extractTaxes = (entities) => {
    let taxes = []
    if (!entities || !entities.length) {
        return taxes
    }

    taxes = entities.map(entity => {
        return {
            id: entity.id,
            value: entity.value,
            type: entity.type
        }
    })
    return taxes
}
const extractLocation = (entities) => {
    let location = []
    if (!entities || !entities.length) {
        return location
    }

    location = entities.map(entity => {
        return {
            coordinates: entity.coordinates,
            name: entity.name
        }
    })
    return location
}

const extractProduct = (entity) => {
    if (!entity) {
        return {}
    }
    return entity._doc ? {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        price: entity.price
    } : {
            id: entity.toString()
        }
}

const extractBatch = (entity) => {
    if (!entity) {
        return {}
    }
    return entity._doc ? {
        id: entity.id,
        quantity: entity.quantity,
        code: entity.code
    } : {
            id: entity.toString()
        }
}

const extractDiscount = (entity) => {
    if (!entity) {
        return {}
    }
    return {
        id: entity.id,
        value: entity.value,
        type: entity.type
    }
}
exports.toModel = entity => {
    const model = {
        id: entity.id,
        status: entity.status
    }

    if (entity.invoice) {
        model.invoice = {
            id: entity.invoice.id,
            code: entity.invoice.code,
            pic: entity.invoice.pic,
            amount: entity.invoice.amount,
            taxes: extractTaxes(entity.invoice.taxes),
            discount: extractDiscount(entity.invoice.discount)
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
                batch: extractBatch(item.batch),
                product: extractProduct(item.product),
                amount: item.amount,
                quantity: item.quantity,
                // discount: extractDiscount(item.discount),  //todo
                taxes: extractTaxes(item.taxes)
            }
        })
    }

    if (entity.customer) {
        model.customer = entity.customer._doc ? {
            id: entity.customer.id,
            profile: profileMapper.toModel(entity.customer.profile)
        } : {
                id: entity.customer.toString()
            }
    }

    if (entity.employee) {
        model.employee = entity.employee._doc ? {
            id: entity.employee.id,
            profile: profileMapper.toModel(entity.employee.profile)
        } : {
                id: entity.employee.toString()
            }
    }

    if (entity.organization) {
        model.organization = entity.organization._doc ? {
            id: entity.organization.id,
            code: entity.organization.code,
            name: entity.organization.name,
            shortName: entity.organization.shortName
        } : {
                id: entity.organization.toString()
            }
    }

    if (entity.store) {
        model.store = entity.store._doc ? {
            id: entity.store.id,
            code: entity.store.code,
            name: entity.store.name,
            shortName: entity.store.shortName,
            pic: entity.store.pic,
            // location: extractLocation(entity.store.location)

        } : {
                id: entity.store.toString()
            }
    }
    return model
}

exports.toSearchModel = entities => {
    return entities.map((entity) => {
        return exports.toModel(entity)
    })
}
