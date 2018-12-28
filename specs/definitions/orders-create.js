const pic = require('./pics')
let batch = require('./batches')

module.exports = {
    store: {
        id: 'string',
        code: 'string'
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
