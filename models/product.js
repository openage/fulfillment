'use strict'

const mongoose = require('mongoose')

module.exports = {
    code: String, // sku,
    name: String, // crocin
    description: String,
    tags: [String],
    pic: {
        url: String,
        thumbnail: String
    },
    brand: String,
    price: Number,
    manufacturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manufacturer'
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
