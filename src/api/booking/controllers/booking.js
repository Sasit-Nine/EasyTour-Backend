'use strict';

/** 
 * booking controller
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::booking.booking', ({ strapi }) => ({
  async createPaymentIntent(ctx) {
    const { bookingId } = ctx.request.body;

    if (!bookingId) {
      return ctx.badRequest('Booking ID is required');
    }

    const booking = await strapi.entityService.findOne('api::booking.booking', bookingId, {
      populate: ['package'],
    });

    if (!booking) {
      return ctx.notFound('Booking not found');
    }

    const totalAmount = booking.total_price * 100; // แปลงเป็นเซ็นต์

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: 'thb',
        metadata: { booking_id: bookingId },
      });

      await strapi.entityService.update('api::booking.booking', bookingId, {
        data: {
          payment_intent_id: paymentIntent.id,
        },
      });

      return ctx.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      strapi.log.error('Error creating payment intent:', error);
      return ctx.internalServerError('An error occurred while creating the payment intent');
    }
  },
}));
