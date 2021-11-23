// Required to stand up the server
import * as Hapi from '@hapi/hapi';

// Import the micro-app's routes.
import routes from './routes';

import config from './config/app';

// Start up our micro-app.
const init = async () => {
  const server = Hapi.server({
    port: 3017,
    host: '0.0.0.0',
  });

  server.route(routes);

  // Start the now fully configured HTTP server.
  await server.start();
  console.log(`Server listening on http://localhost:3017${config.pathPrefix}.`);
};

// Start the micro-app and log any errors.
init().catch((error) => {
  console.log(error);
  throw error;
});
