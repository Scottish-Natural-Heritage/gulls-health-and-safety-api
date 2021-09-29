import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';
import PostcodeLookup from './controllers/postcode-lookup-controller';
import Address from './models/address';
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
  {
    method: 'get',
    path: `/postcode`,
    handler: async (_request: Request, h: ResponseToolkit) => {
      // Grab the Postcode from the query params.
      const postcodeQuery: string = _request.query.q as string;
      // Try to GET the addresses from the Postcode lookup service.
      try {
        const addressResults: Address[] = await PostcodeLookup.findAddresses(postcodeQuery);
        // Return the address results back to the calling application.
        return h.response(addressResults);
      } catch {
        // If something went wrong while trying to find addresses send back a 500 with a error message
        return h.response(new Error('No Postcode provided')).code(500);
      }
    },
  },
];

export default routes;
