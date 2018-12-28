'use strict'
const logger = require('@open-age/logger')('helpers/fileUpload')
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
const rootPath = path.normalize(__dirname + './../')

exports.withFileForm = (req) => {
    let form = new formidable.IncomingForm()
    form.uploadDir = rootPath + 'temp'
    form.keepExtensions = true
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err)
            }
            return resolve(files)
        })
    })
}
