'use strict'

exports.canCreate = async (req) => {
    if (!req.body) {
        return 'invalid request'
    }

    if (!req.context.organization && !req.body.store) {
        return 'invalid request'
    }

    if (!req.body.products) {
        return 'product required'
    }

    if (req.body.customer) {
        if (!req.body.customer.id && !req.body.customer.role) {
            return 'customer id or role required'
        }
    }

    if (req.body.customer && !req.body.store) { // evaluate
        return 'store required'
    }

    if (req.body.store) {
        if (!req.body.store.id && !req.body.store.code) {
            return 'store required'
        }
    }

    if (!req.body.products || !req.body.products.length) {
        return 'products required'
    }
}
