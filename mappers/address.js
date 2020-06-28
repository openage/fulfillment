exports.toModel = (entity, context) => {
    if (!entity) {
        return {}
    }

    return {
        line1: entity.line1,
        line2: entity.line2,
        district: entity.district,
        city: entity.city,
        state: entity.state,
        pinCode: entity.pinCode,
        country: entity.country,
        lat: entity.lat,
        long: entity.long
    }
    
}
