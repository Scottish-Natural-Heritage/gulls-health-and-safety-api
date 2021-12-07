// Required to stand up the server
import * as Hapi from '@hapi/hapi';

// Import the micro-app's routes.
import routes from './routes';

import config from './config/app';

// Use Pino for logging from Hapi
import HapiPino from 'hapi-pino';
import JsonUtils from 'json';

// Start up our micro-app.
const init = async () => {
  const server = Hapi.server({
    port: 3017,
    host: '0.0.0.0',
  });

  server.route(routes);

  // Set up logging. At this time we're only interested in error logging, so
  // we've disabled all of the automatic server access logs.
  await server.register({
    plugin: HapiPino,
    options: {
      logPayload: true,
      logRequestComplete: true,
      logRequestStart: true,
      logEvents: false,
      logRouteTags: false
    }
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
