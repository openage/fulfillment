let location = require('./location')
let address = require('./addresses')
// let proofs = require('./proofs')
let pics = require('./pics')
// let bankDetails = require('./bank-details')
module.exports = {
    id: 'string',
    name: 'string',
    shortName: 'string',
    code: 'string',
    contacts: ['number'],
    address: address,
    location: location,
    pic: pics
}
