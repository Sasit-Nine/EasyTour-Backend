'use strict';


/**
 * payment controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = createCoreController('api::payment.payment',({strapi})=>({
    async createCheckoutSession(ctx){
        try{
            const {packageId} = ctx.request.body
            const tourPackage = await strapi.entityService.findOne('api::package.package',packageId,{
                fields:['name','price']
            })
            if(!tourPackage){
                return ctx.badRequest('Package not Found')
            }
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items:[{
                    price_data:{
                        currency:'thb',
                        product_data:{
                            name: tourPackage.name,
                        },
                        unit_amount: tourPackage.price*100
                    },
                    quantity: 1
                }
                ],
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/checkout-success`,
                cancel_url: `${process.env.FRONTEND_URL}/checkout-cancel`,
            })
            return ctx.send({id:session.id,url:session.url})
        }catch(error){
            console.log('Error creating checkout session:', error)
            return ctx.internalServerError('Error creating checkout session')
        }
    }
}));