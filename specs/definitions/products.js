let pic = require('./pics')
let manufacturer = require('./manufacturers')
let organization = require('./organizations')
let tenant = require('./tenants')
let category = require('./categories')
let batch = require('./batches')
module.exports = {

    name: 'string',
    code: 'string',
    subBrand: 'string',
    price: 'number',
    description: 'string',
    pic: pic,
    batch: batch,
    manufacturer: manufacturer,
    organization: organization,
    tenant: tenant,
    category: category
}
