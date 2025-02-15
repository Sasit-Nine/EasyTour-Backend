'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
    async afterCreate(event){
        const {result} = event
        try {
            await strapi.entityService.update('api::package.package',result.id,{
                data: {
                    package_id: result.id,
                }
            })
        }catch (error) {
            console.log('Error updating package_id:', error)
        }
        try {
            const product = await stripe.products.create({
                name: result.name,
                description: result.description || 'No description available',
            })

            const price = await stripe.prices.create({
                unit_amount: result.price*100,
                currency: 'thb',
                product: product.id
            })

            await strapi.entityService.update('api::package.package',result.id,{
                data:{
                    stripe_product_id: product.id,
                    stripe_price_id: price.id,
                }
            })
        }catch(err){
            console.log('Error creating Stripe product/price:', err)
        }
    }
}