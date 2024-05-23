require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('../server/routes');
const loadModel = require('../services/loadModel');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: process.env.ENVIRONMENT == 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', function (request, h) {
    const response = request.response;

    if (response.isBoom && (response.statusCode == 413 || response.statusCode == 400)) {
      const newResponse = h.response({
        status: 'fail',
        message:
          response.output.statusCode === 413
            ? 'Payload content length greater than maximum allowed: 1000000'
            : `Terjadi kesalahan dalam melakukan prediksi`,
      });
      newResponse.code(response.output.statusCode == 413 ? 413 : 400);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
