"use strict"

/**
 * payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.WEBHOOK_SECRET
let globalBookingID = null;

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async webhook(ctx) {
    console.log('Received webhook body:', ctx.request.body)
    const rawBody = ctx.request.body[Symbol.for("unparsedBody")]
    const sig = ctx.request.headers["stripe-signature"]
    let event
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret)
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return ctx.badRequest("Webhook signature verification failed")
    }

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const paymentIntentId = event.data.object.payment_intent
          const totalAmount = event.data.object.amount_total / 100
          const currency = event.data.object.currency
          console.log(paymentIntentId, totalAmount, currency)
          if (globalBookingID) {
            const newPayment = await strapi.entityService.create("api::payment.payment", {
              data: {
                amount: totalAmount,
                currency: currency,
                status_payment: "Success",
                stripe_payment_id: paymentIntentId,
                booking: globalBookingID,
              },
            })
            console.log("Payment created:", newPayment.id)
          } else {
            console.warn("No matching Booking found.")
          }
          break
        case "charge.updated":
          const receiptUrl = event.data.object.receipt_url
          const paymentRecord = await strapi.entityService.findMany("api::payment.payment",{
            filters:{booking: globalBookingID}
          })
          if(paymentRecord){
            const paymentId = paymentRecord[0].id
            const updatePayment = await strapi.entityService.update("api::payment.payment",paymentId, {
              data: {
                stripe_receipt_url: receiptUrl,
              },
            })
            console.log("Payment url receipt:", updatePayment.id)
          }else{
            console.warn("No matching Booking found.")
          }
          break
        default:
          console.log(`Unhandled event type: ${event.type}`)
      }
    } catch (error) {
      console.error("Error processing Webhook:", error)
    }

    ctx.send({ received: true })
  },

  async createCheckoutSession(ctx) {
    try {
      const { packageId, BookingId, Quantity } = ctx.request.body;
      console.log(BookingId, packageId)
      globalBookingID = BookingId
      const tourPackage = await strapi.entityService.findOne('api::package.package', packageId, {
        fields: ['name', 'price']
      });

      if (!tourPackage) {
        return ctx.badRequest('Package not Found');
      }
      const session = await stripe.checkout.sessions.create({
        line_items: [{
          price_data: {
            currency: 'thb',
            product_data: {
              name: tourPackage.name,
            },
            unit_amount: tourPackage.price * 100
          },
          quantity: Quantity
        }],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/checkout-success`,
        cancel_url: `${process.env.FRONTEND_URL}/packages`,
      });
      return ctx.send({ id: session.id, url: session.url })
    } catch (error) {
      console.log('Error creating checkout session:', error);
      return ctx.internalServerError('Error creating checkout session')
    }
  }


}))
