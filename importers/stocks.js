'use strict'
// let appRoot = require('app-root-path')
// let stock = require(`${appRoot}/services/stocks`)
// let productService = require('../services/products')
// let batchService = require('../services/batches')
// let storeService = require('../services/stores')
var fs = require('fs')
const csv = require('fast-csv')
//  let jsonfile = require('jsonfile')

const mapper = async (items, context) => {
    let product = items.productName
    let code = items.productCode
    let batch = items.batchCode
    let price = items.batchPrice
    let expiry = items.batchExpiry
    let quantity = items.stockQuantity

    // let product = null
    // let store, quantity, unit, position, price, leadQuantity

    // for (var item of items) {
    //     quantity = item.quantity || item.quantity
    //     unit = item.unit || item.Unit
    //     position = item.position || item.Position
    //     price = item.price || item.Price
    //     leadQuantity = item.leadQuantity || item.LeadQuantity

    //     let productId = item.product || item.Product || item.productCode || undefined

    //     let batchId = item.batchId || item.batch || item.batchCode || item.Batch || undefined

    //     let storeId = item.storeId || item.store || item.storeCode || item.Store || undefined
    // }

    return {
        product: {
            name: product,
            code: code,
            batch: {
                code: batch,
                price: price,
                expiry: expiry
            }
        },
        batches: [{
            batch: {
                code: batch,
                expiry: expiry
            },
            price: price,
            quantity: quantity
        }],
        price: price,
        quantity: quantity
    }
}
exports.import = async (req, file) => {
    const items = []
    let stream = fs.createReadStream(file.path)

    return new Promise((resolve, reject) => {
        csv.fromStream(stream, { headers: true, ignoreEmpty: true })
            .on('data', (row) => {
                if (!row.batchCode) {
                    return
                }
                items.push(mapper(row, req.context))
                for (let i = 0; i < items.length; i++) {
                    console.log(items[i])
                }
            })
            .on('end', () => {
                return resolve(items)
            })
    })
}
