'use strict'

const discover = require('@open-age/discover-client')

exports.process = async (store, context) => {

    let log = context.logger.start('processors/entity/create:default')

    if (!store) { return }

    let model = {
        entity: {
            id: store.id,
            type: 'store',
            provider: 'inv'
        },
        name: store.name,
        about: store.about,
        meta: {
            email: store.email,
            phone: store.phone,
        },
        tags: store.tags,
        pic: {
            url: store.pic ? store.pic.url : null,
            thumbnail: store.pic ? store.pic.thumbnail : null
        },
        rating: {
            value: store.ratingValue,
            count: store.ratingCount,
            reviewCount: store.ratingReviewCount,
            oneStar: store.ratingOneStar,
            twoStar: store.ratingTwoStar,
            threeStar: store.ratingThreeStar,
            fourStar: store.ratingFourStar,
            fiveStar: store.ratingFiveStar
        },
        status: store.status
    }

    if(store.address){
        model.location = {
            line1: store.address.line1,
            line2: store.address.line2,
            city: store.address.city,
            district: store.address.district,
            state: store.address.state,
            country: store.address.country,
            pinCode: store.address.pinCode,
            lat: store.address.lat,
            long: store.address.long
        }
    }

    if (store.category) {
        model.categories = [{
            entityId: store.category.id,
            name: store.category.name,
            pic: store.category.pic && (store.category.pic.url || store.category.pic.thumbnail) ? { url: store.category.pic.url, thumbnail: store.category.pic.thumbnail, } : null
        }]
    }

    return discover.profiles.create(model, context).then((profile) => {
        log.info(`store profile succesfully created`)
        return 'store profile succesfully created'
    }).catch((err) => {
        log.error(`error while creating store profile`)
        return err
    })

}