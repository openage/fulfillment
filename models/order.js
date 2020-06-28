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
            }
        }],
        discount: {
            value: Number,
            type: {
                type: String
            }
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

    // statusLogs: [{
    //     old: String,
    //     new: String,
    //     date: {
    //         type: Date,
    //         default: Date.now
    //     },
    //     location: {
    //         coordinates: {
    //             type: [Number], // [<longitude>, <latitude>]
    //             index: '2dsphere' // create the geospatial index
    //         },
    //         name: String,
    //         description: String,
    //         distance: String,
    //         duration: String
    //     },
    //     note: String
    // }],

    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product'
        },
        // batch: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'batch'
        // },
        quantity: Number,
        amount: Number,
        discount: { // returned by BAP
            value: Number,
            type: {
                type: String
            }
        },
        taxes: [{ // returned by BAP
            value: Number,
            type: {
                type: String
            }
        }]
    }],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    pos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pos'
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'store'
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
