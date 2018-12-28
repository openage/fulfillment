let batch = require('./batches')
// let location = require('./location')
let product = require('./products')
let store = require('./stores')

module.exports = {
    quantity: 'number',
    unit: 'number',
    position: 'string',
    // location: location,
    price: 'number',
    leadQuantity: 'number',
    batches: [{
        batch: batch,
        price: 'number',
        quantity: 'number'
    }],
    store: store,
    product: product

}
