'use strict'
const mongoose = require('mongoose')

module.exports = {

    title: { type: String },
    description: { type: String },
    rating: { type: Number },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },

    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store'
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
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
