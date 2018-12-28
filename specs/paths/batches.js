module.exports = [{
    url: '/',
    post: { parameters: ['x-role-key'] },
    get: { parameters: ['x-role-key', 'productId'] }
}, {
    url: '/{id}',
    get: { parameters: ['x-role-key'] }
}]
