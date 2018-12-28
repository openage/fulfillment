'use strict'

const mongoose = require('mongoose')

module.exports = {
    name: String,
    code: String,
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'discount'
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