'use strict'
const mongoose = require('mongoose')
module.exports = {
    name: String,
    code: String,
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
