module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:5173', 'https://w09.pupasoft.com'], 
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: "strapi::body",
    config: {
      jsonLimit: "100mb",
      formLimit: "100mb",
      textLimit: "100mb",
      enableTypes: ["json", "form", "text"],
      multipart: true,
      includeUnparsed: true,
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
