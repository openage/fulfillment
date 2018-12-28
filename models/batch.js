'use strcit'
const mongoose = require('mongoose')
module.exports = {
    code: String,
    date: Date,
    expiry: Date,
    price: Number, // price at which the product of that item is sold
    quantity: {   // Futuristic: no of items produced in that batch
        type: Number,
        min: [0, 'batch out of stock']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}