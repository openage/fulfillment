exports.toModel = (entity, context) => {
    if (!entity) {
        return {}
    }

    return {
        value: entity.value,
            count: entity.count,
            reviewCount: entity.reviewCount,
            oneStar: entity.oneStar,
            twoStar: entity.twoStar,
            threeStar: entity.threeStar,
            fourStar: entity.fourStar,
            fiveStar: entity.fiveStar
    }
    
}
