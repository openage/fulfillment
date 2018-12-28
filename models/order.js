'use strict'
const mongoose = require('mongoose')

module.exports = {
    code: { type: String },

    invoice: { // returned by BAP
        id: String,
        code: String,
        pic: {
            url: String,
            thumbnail: String
        },
        amount: Number, // total of products amount after tax - get from bap
        taxes: [{
            value: Number,
            type: {
                type: String
            },
            id: String
        }],
        discount: {
            value: Number,
            type: {
                type: String
            },
            id: String
        }
    },

    payments: [{ // returned by BAP
        mode: String,
        amount: Number,
        code: String,
        id: String
    }],

    status: {
        type: String,
        default: 'quote',
        enum: ['quote', 'invoiced', 'packed', 'paid', 'dispatched', 'delivered', 'cancelled', 'returned', 'on-hold']
    },

    statusLogs: [{
        old: String,
        new: String,
        date: {
            type: Date,
            default: Date.now
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
        note: String
    }],

    logs: [{
        date: Date,
        status: String,
        comments: String,
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'customer'
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employee'
        }
    }],

    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'organization'
    },

    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store'
    },

    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'batch'
        },
        quantity: Number,
        amount: Number,
        discount: { // returned by BAP
            value: Number,
            type: {
                type: String
            },
            id: String
        },
        taxes: [{ // returned by BAP
            value: Number,
            type: {
                type: String
            },
            id: String
        }]
    }],

    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tenant'
    }
}