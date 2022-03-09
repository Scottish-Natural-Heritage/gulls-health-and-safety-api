// Required to stand up the server
import * as Hapi from '@hapi/hapi';

// Use Pino for logging from Hapi.
import HapiPino from 'hapi-pino';

// Use node-cron for scheduled tasks.
import cron from 'node-cron';

// Use to make HTTP calls.
import axios from 'axios';

// Import the micro-app's routes.
import routes from './routes';

import config from './config/app';
import JsonUtils from './json-utils';

// Cron scheduled tasks, set to trigger at 6am each day.
cron.schedule('0 6 * * *', async () => {
  console.log('Triggering cron job(s).');

  // Check for unconfirmed applications and sent out 14 day reminder emails.
  try {
    await axios.patch(`http://localhost:3017${config.pathPrefix}/reminder`, undefined, {
      params: {
        onBehalfApprovePath: '/gulls-health-and-safety/on-behalf-approve?token=',
      },
    });
  } catch (error: unknown) {
    console.error(JsonUtils.unErrorJson(error));
  }

  // Check for unconfirmed after 21 days applications and send out withdrawn emails.
  try {
    await axios.delete(`http://localhost:3017${config.pathPrefix}/withdrawal`);
  } catch (error: unknown) {
    console.error(JsonUtils.unErrorJson(error));
  }

  console.log('Ending cron job(s).');
});

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
