'use strict'
const mongoose = require('mongoose')

module.exports = {
    code: String,
    name: String,
    description: String,
    shortName: String,
    tags: [String],
    pic: {
        url: String,
        thumbnail: String
    },

    address: {
        line1: String,
        line2: String,
        district: String,
        city: String,
        state: String,
        pinCode: String,
        country: String,
        lat: Number,
        long: Number
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },

    workingStatus: {
        type: String,
        default: 'closed',
        enum: ['open', 'closed']
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },

    timings: {
        opening: Date,
        closing: Date,
        lunchStart: Date,
        lunchEnd: Date,
        teaStart: Date,
        teaEnd: Date
    },

    rating: {
        value: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
        reviewCount: { type: Number, default: 0 },
        oneStar: { type: Number, default: 0 },
        twoStar: { type: Number, default: 0 },
        threeStar: { type: Number, default: 0 },
        fourStar: { type: Number, default: 0 },
        fiveStar: { type: Number, default: 0 }
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
