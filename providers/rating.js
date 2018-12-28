'use strict'

let Client = require('node-rest-client-promise').Client
let client = new Client()
let ratingConfig = require('config').get('providers.rating')
exports.createEntity = (model, context) => {
    let log = context.logger.start('providers:rating')

    if (!model) { return }

    if (!context.role || !context.role.key) {
        return
    }

    let url = `${ratingConfig.url}/api/hooks/entity`
    // let url = "http://localhost:3075/api/hooks/entity"

    log.info(`sending request on rating url: ${url}`)

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': context.role.key
        },
        data: model
    }

    return new Promise((resolve, reject) => {
        log.debug(`url: ${url}`)
        return client.post(url, args, (data, response) => {
            // if (!data || !data.isSuccess) {
            //     log.end()
            //     return reject(new Error(data.error))
            // }
            log.end()
            return resolve(data.data)
        })
    })
}
