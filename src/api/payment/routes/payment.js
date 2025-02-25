'use strict';

/**
 * payment router
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment/checkout',
      handler: 'api::payment.payment.createCheckoutSession', 
      config: {
        auth: false,
      },
    },
    {
      method: 'POST',
      path: '/payment/webhook',
      handler: 'api::payment.payment.webhook', 
      config: {
        auth: false,
      },
    },
    {
      method: 'GET', 
      path: '/payments', 
      handler: 'api::payment.payment.find', 
      config: {
        auth: false,
      },
    },
    {
      method: 'GET', 
      path: '/payments/:id',
      handler: 'api::payment.payment.findOne', 
      config: {
        auth: false,
      },
    },
  ],
};