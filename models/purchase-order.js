'use strcit'
const mongoose = require('mongoose')

module.exports = {
    code: String,
    date: Date,
    status: String,
    description: String,
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        quantity: Number,
        amount: Number
    }],
    amount: Number,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}