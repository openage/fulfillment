'use strict'

let bapInvoiceProvider = require('../../providers/bap/invoice')

exports.process = async (data, context) => {
    let log = context.logger.start('processors/order:cancelled')

    if (!data.id) {
        return
    }

    let order = await db.order.findById(data.id).populate({
        path: 'employee',
        populate: {
            path: 'user'
        }
    })

    if (!order.invoice || !order.invoice.id) {
        return
    }

    log.end()
    return bapInvoiceProvider.update(order.invoice.id, {
        status: 'cancelled'
    }, order.employee.user.role.key, context)
}