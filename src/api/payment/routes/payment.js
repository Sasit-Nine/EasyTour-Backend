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
          auth: false, // ปรับตามต้องการ
        },
      },
    ],
  };
  