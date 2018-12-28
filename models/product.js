'use strict'

const mongoose = require('mongoose')

module.exports = {
    code: String, // sku,
    name: String, // crocin
    description: String,
    pic: {
        url: String,
        thumbnail: String
    },
    subBrand: String,
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
    // batch: {   TODO: obsolete
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'batch'
    // },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    }
}
