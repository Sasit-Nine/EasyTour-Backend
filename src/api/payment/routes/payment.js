'use strict';

/**
 * payment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = {
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
  };
  