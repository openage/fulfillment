const pic = require('./pics')
const location = require('./location')
let batch = require('./batches')

module.exports = {
    store: {
        id: 'string',
        code: 'string'
    },
    status: 'string',
    statusLogs: [{
        date: 'date',
        old: 'string',
        new: 'string',
        location: location,
        note: 'string'
    }],
    products: [{
        product: {
            id: 'string',
            code: 'string'
        },
        batches: [{
            batch: {
                id: 'string',
                code: 'string'
            }
        }],
        amount: 'number',
        quantity: 'number'
    }],
    status: 'string',
    pic: pic
}
