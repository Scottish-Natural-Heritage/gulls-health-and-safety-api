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

  // Get the date.
  const todayDate = new Date();

  // Check for unconfirmed applications and sent out 14 day reminder emails.
  try {
    await axios.patch(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/reminder`, undefined, {
      params: {
        onBehalfApprovePath: '/gulls-health-and-safety/on-behalf-approve?token=',
      },
    });
  } catch (error: unknown) {
    console.error(JsonUtils.unErrorJson(error));
  }

  // Check for unconfirmed after 21 days applications and send out withdrawn emails.
  try {
    await axios.delete(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/withdrawal`);
  } catch (error: unknown) {
    console.error(JsonUtils.unErrorJson(error));
  }

  // Check for expired licences with no returns on 1st March and 1st April and send out reminder emails.
  if (todayDate.getDate() === 1 && (todayDate.getMonth() === 2 || todayDate.getMonth() === 3)) {
    try {
      await axios.post(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/expired-no-return-reminder`);
    } catch (error: unknown) {
      console.error(JsonUtils.unErrorJson(error));
    }
  }

  // Check for expired licences with returns but no final return on 1st March and 1st April and send out reminder emails.
  if (todayDate.getDate() === 1 && (todayDate.getMonth() === 2 || todayDate.getMonth() === 3)) {
    try {
      await axios.post(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/expired-no-final-return-reminder`);
    } catch (error: unknown) {
      console.error(JsonUtils.unErrorJson(error));
    }
  }

  // Check for licences at least 3 weeks old without a return and send out a reminder on the 1st of every month.
  if (todayDate.getDate() === 1) {
    try {
      await axios.post(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/return-reminder-current-season`);
    } catch (error: unknown) {
      console.error(JsonUtils.unErrorJson(error));
    }
  }

  // Check for valid licences that are due to expire, on the 15th of January.
  if (todayDate.getDate() === 15 && todayDate.getMonth() === 0) {
    try {
      await axios.post(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/soon-to-expire-return-reminder`);
    } catch (error: unknown) {
      console.error(JsonUtils.unErrorJson(error));
    }
  }

  // Resend any licences issued before test 3 deployment. Commented out but left in
  // as we may want to use this again.
  // try {
  //   await axios.post(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/resend-licences`);
  // } catch (error: unknown) {
  //   console.error(JsonUtils.unErrorJson(error));
  // }

  console.log('Ending cron job(s).');
});


// Cron scheduled tasks, set to trigger at 6am each day.
cron.schedule('30 10 * * *', async () => {
  console.log('Triggering test cron job(s).');
   // Check for licences at least 3 weeks old without a return and send out a reminder on the 1st of every month.
    try {
      await axios.post(`http://localhost:${config.gullsApiPort}${config.pathPrefix}/return-reminder-current-season`);
    } catch (error: unknown) {
      console.error(JsonUtils.unErrorJson(error));
    }
  
    console.log('Ending test cron job(s).');
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
