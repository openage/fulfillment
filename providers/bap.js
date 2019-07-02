'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
let bapConfig = require('config').get('providers.bap')

/* create product as entity in billing and payment services */

exports.createEntity = (model, context) => {
    let log = context.logger.start('providers:bap:createEntity')

    if (!model) { return }

    if (!context.role && !context.role.key) {
        return
    }

    let url = `${bapConfig.url}/api/hooks/entity`

    log.debug(`sending request on bap url: ${url}`)

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': context.role.key
        },
        data: model
    }

    return new Promise((resolve, reject) => {
        return client.post(url, args, (data, response) => {
            if (!data || !data.isSuccess) {
                log.end()
                return reject(new Error(data.error))
            }
            log.end()
            return resolve(data.data)
        })
    })
}
