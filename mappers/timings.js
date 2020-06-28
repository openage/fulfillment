exports.toModel = (entity, context) => {
    if (!entity) {
        return {}
    }

    return {
        opening: entity.opening,
        closing: entity.closing,
        lunchStart: entity.lunchStart,
        lunchEnd: entity.lunchEnd,
        teaStart: entity.teaStart,
        teaEnd: entity.teaEnd
    }

}
