'use strict'

const stocksService = require('../services/stocks')
const mapper = require('../mappers/stock')

exports.create = async (req) => {
    const log = req.context.logger.start('api/stocks:create')

    const stock = await stocksService.create(req.body, req.context)

    log.end()

    return mapper.toModel(stock)
}

exports.get = async (req) => {
    const log = req.context.logger.start('api/stocks:get')

    const stock = await stocksService.getById(req.params.id, req.context)

    log.end()

    return mapper.toModel(stock)
}

// exports.update = async (req) => {
//     const log = req.context.logger.start('api/stocks:update')

//     const stock = await stocks.update(req.body, req.params.id, req.context)

//     log.end()
//     return mapper.toModel(stock)
// }

exports.search = async (req) => {
    const log = req.context.logger.start('api/stocks:search')

    const stockList = await stocksService.search(req.query, req.context)

    log.end()

    return mapper.toSearchModel(stockList)
}

exports.bulk = async (req) => {
    req.context.logger.start('api/stocks:bulkUpload')
    // get the json file
    //     for (const item of req.body.items) {
    //         await stocksService.create(item, req.context)
    //     }
    //     return 'File Uploaded Successfully'
    // }
    return Promise.each(req.body.items, async (item) => {
        await stocksService.create(item, req.context)
    }).then(() => {
        return 'File Uploaded Successfully'
    })
}
