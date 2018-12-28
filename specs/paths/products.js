module.exports = [{
    url: '/',
    post: { parameters: ['x-role-key'] },
    get: { parameters: [
        'x-role-key',
        { name: 'name', in: 'query', description: 'product name or code', required: false, type: 'string' }] }
}, {
    url: '/{id}',
    get: { parameters: ['x-role-key'] }
}]
