module.exports = [{
    url: '/',
    get: {
        permissions: ['tenant.guest', 'tenant.user']
    }
}, {
    url: '/:id',
    put: {
        permissions: ['tenant.admin']
    },
    delete: {
        permissions: ['tenant.admin']
    },
    get: {
        permissions: ['tenant.guest', 'tenant.user']
    }
}]
