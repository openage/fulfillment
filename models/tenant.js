'use strict'
const mongoose = require('mongoose')

module.exports = {
    name: String,
    code: String, // sku,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },
    logo: {
        url: String,
        thumbnail: String
    }
}
