'use strict'
var db = require('../models')

const setContext = (context, logger) => {
    context.logger = logger

    context.where = () => {
        let clause = {}

        if (context.organization) {
            clause.organization = context.organization.id.toObjectId()
        } else if (context.tenant) {
            clause.tenant = context.tenant.id.toObjectId()
        }
        let filters = {}

        filters.add = (field, value) => {
            clause[field] = value
            return filters
        }

        filters.clause = clause

        return filters
    }

    return context
}

exports.create = (claims, logger) => {
    let role = claims.role

    let customer = null
    if (claims.customer) {
        customer = Promise.resolve(claims.customer)
    } else if (!claims.customerId) {
        customer = Promise.resolve(null)
    } else {
        customer = db.customer.findOne({
            _id: claims.customerId
        }).populate('client tenant')
    }

    let employee = null

    if (claims.employee) {
        employee = Promise.resolve(claims.employee)
    } else if (!claims.employeeId) {
        employee = Promise.resolve(null)
    } else {
        employee = db.employee.findOne({
            _id: claims.employeeId
        }).populate('owner tenant')
    }

    let store = null

    if (claims.store) {
        store = Promise.resolve(claims.store)
    } else if (!claims.storeId) {
        store = Promise.resolve(null)
    } else {
        store = db.employee.findOne({
            _id: claims.storeId
        })
    }

    let organization = null

    if (claims.organization) {
        organization = Promise.resolve(claims.organization)
    } else if (!claims.organizationId) {
        organization = Promise.resolve(null)
    } else {
        organization = db.organization.findOne({
            _id: claims.organizationId
        }).populate('owner tenant')
    }

    let tenant = null
    if (claims.tenant) {
        tenant = Promise.resolve(claims.tenant)
    } else if (!claims.tenantId) {
        tenant = Promise.resolve(null)
    } else {
        tenant = db.tenant.findOne({
            _id: claims.tenantId
        }).populate('owner')
    }

    let user = null
    if (claims.user) {
        user = Promise.resolve(claims.user)
    } else if (!claims.userId) {
        user = Promise.resolve(null)
    } else {
        user = db.user.findOne({
            _id: claims.userId
        }).populate('tenant')
    }

    return Promise.all([role, customer, employee, organization, tenant, user, store]).spread((role, customer, employee, organization, tenant, user, store) => {
        return setContext({
            role: role,
            customer: customer,
            employee: employee,
            store: store,
            organization: organization,
            tenant: tenant,
            user: user
        }, logger)
    })
}

exports.serialize = (context) => {
    let serialized = {}

    if (context.customer) {
        serialized.customerId = context.customer.id
    }

    if (context.employee) {
        serialized.employeeId = context.employee.id
    }

    if (context.store) {
        serialized.storeId = context.store.id
    }

    if (context.tenant) {
        serialized.tenantId = context.tenant.id
    }

    if (context.organization) {
        serialized.organizationId = context.organization.id
    }

    if (context.user) {
        serialized.userId = context.user.id
    }

    return Promise.resolve(serialized)
}
