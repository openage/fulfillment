'use strict'

const client = new(require('node-rest-client-promise')).Client()
const directory = require('config').get('providers').directory

const getRoleByKey = (roleKey, roleId, context) => {
    const log = context.logger.start('getRoleByKey')

    let args = {
        headers: {
            'Content-Type': 'application/json',
            'x-role-key': roleKey // role key here
        },
        path: {
            'id': roleId || 'my'
        }
    }
    let id = roleId || 'my'
    log.info(`sending request to url: ${directory.url}/roles/${id}`)

    return client.getPromise(directory.url + `/roles/${id}`, args)
        .then((role) => {
            if (!role.data.isSuccess) {
                return Promise.reject(new Error('invalid response from directory'))
            }
            log.end()
            return Promise.resolve(role.data.data)
        })
        .catch((err) => {
            log.error(err)
            log.end()
            return Promise.reject(err)
        })
}

exports.getRoleByKey = getRoleByKey