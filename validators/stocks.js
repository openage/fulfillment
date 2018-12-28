'use strict'

const fileUpload = require('../helpers/fileUpload')
// const stockExtractor = require('../extractors/stocks')

exports.canBulkUpload = async (req) => {
    let files = await fileUpload.withFileForm(req)

    if (!files.record || !files.body.record) {
        return 'file not found'
    }

    // req.data = await stockExtractor.extract(files)
}
