'use strict'

const mongoose = require('mongoose')

module.exports = {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    discount: {
        value: Number,
        type: {
            type: String // amount, percentage
        }
    },
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
