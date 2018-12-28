'use strcit'
const mongoose = require('mongoose')

module.exports = {
    name: String,
    code: String,
    financial: {
        taxNumber: String
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        price: Number,
        moq: Number,
        leadTime: Number // no of days
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
