'use strict'

const mongoose = require('mongoose')

module.exports = {
    role: {
        id: String,
        code: String,
        key: String,
        permissions: []
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
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
