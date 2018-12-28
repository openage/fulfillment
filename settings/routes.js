'use strict'
var auth = require('../helpers/auth')
var apiRoutes = require('@open-age/express-api')
var fs = require('fs')
var loggerConfig = require('config').get('logger')
var appRoot = require('app-root-path')

const specs = require('../specs')

module.exports.configure = (app, logger) => {
    logger.start('settings/routes:configure')

    let specsHandler = function (req, res) {
        fs.readFile('./public/specs.html', function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.contentType('text/html')
            res.send(data)
        })
    }

    app.get('/', specsHandler)

    app.get('/logs', function (req, res) {
        var filePath = appRoot + '/' + loggerConfig.file.filename

        fs.readFile(filePath, function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.contentType('application/json')
            res.send(data)
        })
    })

    app.get('/swagger', (req, res) => {
        res.writeHeader(200, {
            'Content-Type': 'text/html'
        })
        fs.readFile('./public/swagger.html', null, function (err, data) {
            if (err) {
                res.writeHead(404)
                res.end()
                return
            }
            res.write(data)
            res.end()
        })
    })

    app.get('/specs', specsHandler)

    app.get('/api/specs', function (req, res) {
        res.contentType('application/json')
        res.send(specs.get())
    })

    var api = apiRoutes(app)

    api.model('vendors').register('REST', [auth.requireEmployee])
    api.model('categories').register('REST', [auth.requireEmployee])
    api.model('manufacturers').register('REST', [auth.requireEmployee])
    api.model('employees').register('REST', [auth.requireEmployee])
    api.model('products').register('REST', [auth.requireEmployee])
    api.model('batches').register('REST', [auth.requireEmployee])
    api.model('customers').register('REST', [auth.requiresRoleKey])
    api.model('stores').register([{
        action: 'POST',
        method: 'create',
        filter: auth.requireEmployee
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        filter: auth.requiresRoleKey
    }, {
        action: 'GET',
        method: 'search',
        filter: auth.requiresRoleKey
    }, {
        action: 'PUT',
        method: 'update',
        url: '/:id',
        filter: auth.requireEmployee
    }])
    api.model('stocks').register([{
        action: 'POST',
        method: 'create',
        filter: auth.requireEmployee
    }, {
        action: 'GET',
        method: 'get',
        url: '/:id',
        filter: auth.requireEmployee
    }, {
        action: 'GET',
        method: 'search',
        filter: auth.requireEmployee
    }, {
        action: 'POST',
        method: 'bulk',
        url: '/bulk',
        filter: auth.requireEmployee
    }])
    api.model('orders')
        .register([{
            action: 'POST',
            method: 'create',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'get',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'search',
            filter: auth.requiresRoleKey
        }, {
            action: 'PUT',
            method: 'update',
            url: '/:id',
            filter: auth.requiresRoleKey
        }, {
            action: 'GET',
            method: 'customerOrders',
            url: '/customer/:id',
            filter: auth.requiresRoleKey
        }])
    api.model('tenants').register('REST')
    api.model('organizations').register('REST', [auth.requireEmployee])
}
