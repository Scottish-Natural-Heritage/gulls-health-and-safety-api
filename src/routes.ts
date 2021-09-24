import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';

/**
 * An array of all the routes and controllers in the app.
 */
const routes: ServerRoute[] = [
  {
    method: 'get',
    path: `/`,
    handler: (_request: Request, h: ResponseToolkit) => {
      return h.response({message: 'Hello, world!'});
    },
  },
];

export default routes;
