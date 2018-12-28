'use strict'

const employees = require('../services/employees')
const mapper = require('../mappers/employees')

exports.create = async (req) => {
    const log = req.context.logger.start('api/employees:create')

    const employee = await employees.create(req.body, req.context)

    log.end()

    return mapper.toModel(employee)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/employees:get')

    const employee = await employees.get(req.params.id, req.context)

    log.end()

    return mapper.toModel(employee)
}

exports.search = async (req) => {
    const log = req.context.logger.start('api/employees:search')

    const query = {}

    const employeeList = await employees.search(query, req.context)

    log.end()

    return mapper.toSearchModel(employeeList)
}
