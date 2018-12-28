'use strcit'
const mongoose = require('mongoose')

module.exports = {
    quantity: {
        type: Number,
        min: [0, 'stock not found']
    },
    unit: String, // boxes, kg, bottles,ml, tablets
    position: String, // rack no/shelf no
    price: Number,
    leadQuantity: Number, // no of least quantity required in stock
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store'
    },
    batches: [{
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'batch'
        },
        price: { type: Number, min: 0 },
        quantity: { type: Number, min: 0 },
        unit: String, // boxes, kg, bottles,
        purchaseOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'purchaseOrder'
        }
    }],
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
