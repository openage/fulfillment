'use strict'

const mongoose = require('mongoose')

module.exports = {
    profile: {
        firstName: String,
        lastName: String,
        pic: {
            url: String,
            thumbnail: String
        },
        dob: Date,
        fatherName: String,
        bloodGroup: String,
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
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
