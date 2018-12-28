'use strict'
const db = require('../models')
// const tenants = require('../services/tenants')
const users = require('../services/users')
const contextBuilder = require('./context-builder')
// const directory = require('../providers/directory')

const fetch = (req, modelName, paramName) => {
    var value = req.query[`${modelName}-${paramName}`] || req.headers[`x-${modelName}-${paramName}`]
    if (!value && req.body[modelName]) {
        value = req.body[modelName][paramName]
    }
    if (!value) {
        return null
    }

    var model = {}
    model[paramName] = value
    return model
}

const getByUser = async (user, storeModel, logger) => {
    let employee = await db.employee
        .findOne({
            user: user
        })
        .populate('organization tenant')

    let contextModel = {
        user: user,
        role: user.role,
        tenant: user.tenant
    }

    if (employee) {
        contextModel.employee = employee
        contextModel.organization = employee.organization
        contextModel.tenant = employee.tenant
    } else {
        let customer = await db.customer // evaluate customer
            .findOne({
                user: user
            })
            .populate('organization tenant')

        if (customer) {
            contextModel.customer = customer
            contextModel.organization = customer.organization
            contextModel.tenant = customer.tenant
        }
    }

    if (storeModel && contextModel.organization) {
        let storeQuery = {
            organization: contextModel.organization
        }

        if (storeModel.id) {
            storeQuery._id = storeModel.id
        } else {
            storeQuery.code = storeModel.code
        }
        contextModel.store = await db.store.findOne(storeQuery)
    }

    return contextBuilder.create(contextModel, logger)
}

const getByRoleKey = async (req, logger) => {
    let log = logger.start('requiresRoleKey')

    var role = fetch(req, 'role', 'key')

    var store = fetch(req, 'store', 'id')
    if (!store) {
        store = fetch(req, 'store', 'code')
    }

    if (!role) {
        throw new Error('x-role-key is required')
    }

    log.info(role)

    let user = await users.get({
        role: {
            key: role.key
        }
    }, {
        logger: log
    })
    let context = await getByUser(user, store, logger)
    log.end()
    return context
}

exports.requireEmployee = (req, res, next) => {
    res.logger.start('requiresRoleKey')
    getByRoleKey(req, res.logger).then((context) => {
        if (!context.employee) {
            return res.accessDenied('invalid role key', 403)
        }
        req.context = context
        next()
    }).catch((err) => {
        return res.failure(err, 403)
    })
}

exports.requiresRoleKey = (req, res, next) => {
    res.logger.start('requiresRoleKey')
    getByRoleKey(req, res.logger).then((context) => {
        if (!context) {
            return res.accessDenied('invalid role key', 403)
        }
        req.context = context
        next()
    }).catch((err) => {
        return res.failure(err)
    })
}

exports.requireCustomer = (req, res, next) => {
    res.logger.start('requiresRoleKey')
    getByRoleKey(req, res.logger).then((context) => {
        if (!context.customer) {
            return res.accessDenied('invalid role key', 403)
        }
        req.context = context
        next()
    }).catch((err) => {
        return res.failure(err)
    })
}