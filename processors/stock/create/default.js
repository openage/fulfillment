'use strict'

const discover = require('@open-age/discover-client')

exports.process = async (stock, context) => {

    let log = context.logger.start('processors/entity/create:default')

    if (!stock) { return }

    if (!stock.product) { return }

    let model = {
        entity: {
            id: stock.id,
            type: 'stock',
            provider: 'inv'
        },
        name: stock.product.name,
        about: stock.product.about,
        meta: {
            quantity: stock.quantity,
            unit: stock.unit
        },
        tags: stock.product.tags,
        price: stock.product.price,
        pic: {
            url: stock.product.pic ? stock.product.pic.url : null,
            thumbnail: stock.product.pic ? stock.product.pic.thumbnail : null
        },
        rating: {
            value: stock.product.ratingValue,
            count: stock.product.ratingCount,
            reviewCount: stock.product.ratingReviewCount,
            oneStar: stock.product.ratingOneStar,
            twoStar: stock.product.ratingTwoStar,
            threeStar: stock.product.ratingThreeStar,
            fourStar: stock.product.ratingFourStar,
            fiveStar: stock.product.ratingFiveStar
        },
        status: stock.product.status
    }

    if (stock.product.category) {
        model.categories = [{
            entityId: stock.product.category.id,
            name: stock.product.category.name,
            pic: store.category.pic && (store.category.pic.url || store.category.pic.thumbnail) ? { url: store.category.pic.url, thumbnail: store.category.pic.thumbnail, } : null
        }]
    }

    return discover.profiles.create(model, context).then((profile) => {
        log.info(`stock profile succesfully created`)
        return 'stock profile succesfully created'
    }).catch((err) => {
        log.error(`error while creating stock profile`)
        return err
    })

}