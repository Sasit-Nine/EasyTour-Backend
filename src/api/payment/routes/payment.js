'use strict';

/**
 * payment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::payment.payment', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
  },
  routes: [
    {
      method: "POST",
      path: "/payment/checkout",
      handler: "payment.createCheckoutSession",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/payment/webhook",
      handler: "payment.webhook",
      config: {
        auth: false,
      },
    },
  ],
});
