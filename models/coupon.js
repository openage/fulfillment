'use strict'

const mongoose = require('mongoose')

module.exports = {
    code: String,
    name: String,
    value: Number,
    type: {
        type: String // amount, percentage
    },
    start: Date,
    expires: Date,
    status: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
