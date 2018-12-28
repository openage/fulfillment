'use strict'

const mongoose = require('mongoose')

module.exports = {
    name: String,
    shortName: String,
    code: String, // sku,

    logo: {
        url: String,
        thumbnail: String
    },

    address: {
        line1: String,
        line2: String,
        district: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    vendors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vendor'
    }],
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
