'use strict'
const mongoose = require('mongoose')

module.exports = {
    name: String,
    code: String,
    shortName: String,
    pic: {
        url: String,
        thumbnail: String
    },
    about: String,
    images: String, // TODO: obsolete
    contacts: [{ }],
    proof: {
        type: String,
        picUrl: String
    },

    address: {
        line1: String,
        line2: String,
        district: String,
        city: String,
        state: String,
        pinCode: String,
        country: String
    },

    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },

    location: {
        coordinates: {
            type: [Number], // [<longitude>, <latitude>]
            index: '2dsphere' // create the geospatial index
        },
        name: String,
        description: String,
        distance: String,
        duration: String
    },

    rating: {
        value: {
            type: Number,
            default: 0
        },
        rateCount: {
            type: Number,
            default: 0
        },
        reviewCount: {
            type: Number,
            default: 0
        },
        oneStar: {
            type: Number,
            default: 0
        },
        twoStar: {
            type: Number,
            default: 0
        },
        threeStar: {
            type: Number,
            default: 0
        },
        fourStar: {
            type: Number,
            default: 0
        },
        fiveStar: {
            type: Number,
            default: 0
        }
    },

    pan: String,
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}
