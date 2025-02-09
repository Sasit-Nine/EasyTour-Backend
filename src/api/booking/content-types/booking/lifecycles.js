'use strict';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async afterCreate(event) {
    const { result } = event;

    // ตรวจสอบว่ามี total_price ก่อน
    if (!result.total_price) {
      strapi.log.warn('Total price is missing in the booking');
      return;
    }

    // สร้าง PaymentIntent ใน Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: result.total_price * 100, // แปลงเป็นเซ็นต์
        currency: 'thb', // หรือสกุลเงินอื่น ๆ ตามที่ต้องการ
        metadata: { booking_id: result.id },
      });

      // อัปเดต booking ด้วย payment_intent_id ที่ได้จาก Stripe
      await strapi.entityService.update('api::booking.booking', result.id, {
        data: {
          payment_intent_id: paymentIntent.id,
        },
      });

      strapi.log.info(`PaymentIntent created for booking ${result.id}`);
    } catch (error) {
      strapi.log.error('Error creating PaymentIntent:', error);
    }
  }
};
