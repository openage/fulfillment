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
            enum: ['male', 'female', 'others']
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    membership: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'membership'
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
