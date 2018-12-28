'use strict'
const db = require('../models')
const organizations = require('../services/organizations')

const directory = require('../providers/directory')
const tenants = require('../services/tenants')

const sync = async (model, context) => {
    const log = context.logger.start('services/users:sync')
    if (!model) {
        return null
    }

    let user = await db.user.findOne({
        'role.id': model.id
    }).populate('tenant')

    if (!user) {
        user = await create({
            status: 'active',
            tenant: model.tenant.id || context.tenant
        }, context)
    }

    if (model.employee) {
        let organization = await organizations.getOrCreate(model.organization, context)

        let employee = await db.employee.findOne({
            'user': user
        }).populate('organization tenant')

        if (!employee) {
            employee = new db.employee({ // TODO
                user: user,
                status: 'active',
                organization: organization,
                tenant: context.tenant
            })
        }

        // update attributes
        employee.profile = employee.profile || {}
        employee.profile.firstName = model.employee.firstName
        employee.profile.lastName = model.employee.lastName
        employee.profile.pic = model.employee.profile.pic
        employee.profile.dob = model.employee.profile.dob
        employee.profile.gender = model.employee.profile.gender
        employee.profile.bloodGroup = model.employee.profile.bloodGroup

        await employee.save()
    }

    user.role = user.role || {}
    user.role.id = `${model.id}`
    user.role.key = model.key
    user.role.code = model.code
    user.role.permissions = model.permissions || []

    await user.save()
    log.end()
    return user
}

const create = async (model, context) => {
    let log = context.logger.start('services/users:create')

    if (!model.tenant) {
        model.tenant = context.tenant.id
    }
    log.end()
    return new db.user(model).save()
}

const get = async (query, context) => {
    let log = context.logger.start('services/users:get')
    let where = {
        // tenant: context.tenant
    }

    let user
    if (typeof query === 'string') {
        if (query.isObjectId()) {
            user = await db.user.findById(query)
        }
        where['role.key'] = query
        user = await db.user.findOne(where)
    } else if (query.id) {
        user = await db.user.findById(query.id)
    } else if (query.role) {
        if (query.role.code) {
            where['role.code'] = query.role.code
        }

        if (query.role.id) {
            where['role.id'] = query.role.id
        }

        if (query.role.key) {
            where['role.key'] = query.role.key
        }

        user = await db.user.findOne(where)
    }

    if (!user) {
        if (!query.role) {
            throw new Error('role is required')
        }

        if (query.role.key) {
            let roleKey = query.role.key || context.role.key
            let roleId = query.role.id || 'my'

            log.debug('key does not exit, checking with directory')

            let model = await directory.getRoleByKey(roleKey, roleId, {
                logger: log
            }).catch((err) => {
                throw new Error(err)
            })

            if (!model) {
                throw new Error('invalid role key')
            }

            log.debug('got the data for ed, synchronizing it')

            // TODO fixing tenant owner
            let tenant = await tenants.getOrCreate(model.tenant, {
                logger: log
            })

            user = await sync(model, {
                tenant: tenant,
                logger: log
            })
        } else {
            user = await create(query, context)
        }
    }

    log.end()
    return user
}

exports.sync = sync
exports.get = get
exports.create = create
