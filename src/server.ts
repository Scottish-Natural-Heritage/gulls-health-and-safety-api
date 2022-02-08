// Required to stand up the server
import * as Hapi from '@hapi/hapi';

// Use Pino for logging from Hapi.
import HapiPino from 'hapi-pino';

// Import the micro-app's routes.
import routes from './routes';

import config from './config/app';
import JsonUtils from './json-utils';

// Start up our micro-app.
const init = async () => {
  const server = Hapi.server({
    port: 3017,
    host: '0.0.0.0',
  });

  server.route(routes);

  // Set up logging on POST, PATCH and DELETE requests.
  await server.register({
    plugin: HapiPino,
    options: {
      logPayload: true,
      logRequestComplete: (request: Hapi.Request) => {
        return request.method === 'post' || request.method === 'patch' || request.method === 'delete';
      },
      logRequestStart: (request: Hapi.Request) => {
        return request.method === 'post' || request.method === 'patch' || request.method === 'delete';
      },
      logEvents: ['onPostStart', 'onPostStop', 'response', 'request-error'],
      logRouteTags: false,
    },
  });

  // Start the now fully configured HTTP server.
  await server.start();
  server.logger.info(`Server listening on http://localhost:3017${config.pathPrefix}.`);
};

// Start the micro-app and log any errors.
init().catch((error) => {
  console.error(JsonUtils.unErrorJson(error));
  throw error;
});
