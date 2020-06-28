const mongoose = require('mongoose')

module.exports = {
    price: { type: Number, min: 0 },
    quantity: { type: Number, min: 0 },
    unit: String, // boxes, kg, bottles,ml, tablets
    isUnlimited: Boolean,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store'
    },

    position: String, // rack no/shelf no
    leadQuantity: Number, // no of least quantity required in stock
    batches: [{
        date: Date,
        expiry: Date,
        price: { type: Number, min: 0 },
        quantity: { type: Number, min: 0 },
        unit: String // boxes, kg, bottles,
    }],
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
