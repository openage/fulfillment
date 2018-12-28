let invoice = require('./invoice')
let discount = require('./discounts')
let payment = require('./payment')
let transaction = require('./transactions')
let pics = require('./pics')
let taxes = require('./taxes')
let location = require('./location')
// let customers = require('./customers')
// let products = require('./products')

module.exports = {
    id: 'string',
    amount: 'number',
    store: {
        id: 'string'
    },
    customer: {
        id: 'string',
        role: {
            id: 'string'
        }
    },
    products: [{
        product: {
            id: 'string',
            code: 'string'
        },
        batch: {
            id: 'string',
            code: 'string'
        },
        amount: 'number',
        quantity: 'number'
    }],
    taxes: taxes,
    discount: discount,
    status: 'string',
    statusLogs: [{
        id: 'string',
        date: 'date',
        old: 'string',
        new: 'string',
        location: location,
        note: 'string'
    }],
    payment: payment,
    transaction: transaction,
    invoice: invoice,
    pic: pics
}
