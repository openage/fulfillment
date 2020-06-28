module.exports = [{
    url: '/',
    get: {
        permissions: ['tenant.guest', 'tenant.user']
    }
}, {
    url: '/:id',
    put: {
        permissions: ['organization.admin']
    },
    get: {
        permissions: ['tenant.guest', 'tenant.user']
    }
}]
