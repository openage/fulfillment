'use strict'
const db = require('../models')

exports.create = async (model, context) => {
    const log = context.logger.start('services/employees:create')

    const employee = await new db.employee(model).save()

    log.end()
    return employee
}

exports.get = async (id, context) => {
    const log = context.logger.start('services/employees:get')

    const employee = await db.employee.findById(id)

    log.end()
    return employee
}

exports.search = async (query, context) => {
    const log = context.logger.start('services/employees:search')

    const employees = await db.employee.find(query)

    log.end()
    return employees
}
// from roles/my
exports.sync = async (model, context) => {
    const log = context.logger.start('services/employees:sync')
    if (!model) {
        return null
    }

    let employee = await db.employee.findOne({
        'organization': context.organization,
        'role.id': model.id
    }).populate('organization')

    if (!employee) {
        employee = await db.employee.findOne({
            'organization': context.organization,
            code: model.employee.code
        }).populate('organization')
    }

    if (!employee) {
        employee = await new db.employee({
            status: 'active',
            organization: context.organization
        }).save()
    }

    employee.role = employee.role || {}
    employee.role.id = `${model.id}`
    employee.role.key = model.key
    employee.role.permissions = model.permissions || []

    // update attributes
    employee.profile = employee.profile || {}
    employee.profile.firstName = model.employee.firstName
    employee.profile.lastName = model.employee.lastName
    employee.profile.pic = model.employee.profile.pic
    employee.profile.dob = model.employee.profile.dob
    employee.profile.gender = model.employee.profile.gender
    employee.profile.bloodGroup = model.employee.profile.bloodGroup

    await employee.save()
    log.end()
    return employee
}
