exports.toModel = (entity, context) => {
    if (!entity) {
        return {}
    }

    return {
        url: entity.url,
        thumbnail: entity.thumbnail
    }
}
