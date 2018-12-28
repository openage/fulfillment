module.exports = [{
    url: '/',
    post: { parameters: ['x-role-key'] },
    get: {
        parameters: [
            'x-role-key',
            { name: 'nearby', in: 'query', description: ' true for nearby hospital', required: false, type: 'string' },
            { name: 'latitude', in: 'query', description: 'latitude', required: false, type: 'string' },
            { name: 'longitude', in: 'query', description: 'longitude', required: false, type: 'string' },
            { name: 'cityName', in: 'query', description: 'city name', required: false, type: 'string' },
            { name: 'minDistance', in: 'query', description: 'minimum distance in meters', required: false, type: 'string' },
            { name: 'maxDistance', in: 'query', description: 'maximum distance in meters', required: false, type: 'string' },
            { name: 'pageNo', in: 'query', description: 'pageNo', required: false, type: 'number' },
            { name: 'serverPaging', in: 'query', description: 'serverPaging', required: false, type: 'boolean' },
            { name: 'pageSize', in: 'query', description: 'pageSize', required: false, type: 'number' }
        ]
    }
}, {
    url: '/{id}',
    put: { parameters: ['x-role-key'] },
    get: { parameters: ['x-role-key'] }
}]
