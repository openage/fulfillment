'use strict'

const mongoose = require('mongoose')

module.exports = {
    name: String,
    code: String,
    value: Number,
    type: {
        type: String
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
