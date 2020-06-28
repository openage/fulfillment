'use strict'

const mongoose = require('mongoose')

module.exports = {
    code: String,
    name: String,
    description: String,
    pic: {
        url: String,
        thumbnail: String
    },
    status: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant' }
}
