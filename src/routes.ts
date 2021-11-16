import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';
import PostcodeLookupController from './controllers/postcode-lookup-controller';
import PostcodeLookup from './models/postcode-lookup';

// import ActivityController from './controllers/activity';
// import AddressController from './controllers/address';
// import ApplicationController from './controllers/application';
// import ContactController from './controllers/contact';
// import IssueController from './controllers/issue';
// import MeasureController from './controllers/measure';
import SpeciesController from './controllers/species';

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
    handler: async (request: Request, h: ResponseToolkit) => {
      // Grab the Postcode from the query params.
      const postcodeQuery: string = request.query.q as string;
      // Try to GET the addresses from the Postcode lookup service.
      try {
        const addressResults: PostcodeLookup = await PostcodeLookupController.findAddresses(postcodeQuery);
        // Return the address results back to the calling application.
        // If there was addresses that matched a valid postcode then return the address results array
        // else there was no matching address results from the postcode then return the results array. which contains a text entry 'No records found.'
        return addressResults.results[0].address
          ? h.response(addressResults.results[0].address)
          : h.response(addressResults.results[0]);
      } catch {
        // If something went wrong while trying to find addresses send back a 500 with a error message
        return h.response({message: 'Invalid postcode.'}).code(500);
      }
    },
  },
  {
    method: 'get',
    path: `/test`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const species = await SpeciesController.findAll();
        console.log(species);
        return h.response(species);
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
  },
];

export default routes;
