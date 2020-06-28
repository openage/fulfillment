const mongoose = require('mongoose')

module.exports = {
    code: String,
    name: String,
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'inactive']
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'store' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'organization' },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'tenant' }
}
