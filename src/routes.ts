import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';
import PostcodeLookupController from './controllers/postcode-lookup-controller';
import PostcodeLookup from './models/postcode-lookup';
import Application from './controllers/application';
import CleaningFunctions from './controllers/cleaning-functions';
import config from './config/app';

/**
 * An array of all the routes and controllers in the app.
 */
const routes: ServerRoute[] = [
  {
    method: 'get',
    path: `${config.pathPrefix}/`,
    handler: (_request: Request, h: ResponseToolkit) => {
      return h.response({message: 'Hello, world!'});
    },
  },
  {
    method: 'get',
    path: `${config.pathPrefix}/postcode`,
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
    path: `${config.pathPrefix}/application/{id}`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Try to get the requested application.
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        // Return the application.
        return h.response(application).code(200);
      } catch (error: unknown) {
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  {
    method: 'post',
    path: `${config.pathPrefix}/application`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Get the payload from the request.
        const application = request.payload as any;

        let onBehalfContact;
        let address;
        let siteAddress;
        let herringActivity;
        let blackHeadedActivity;
        let commonActivity;
        let greatBlackBackedActivity;
        let lesserBlackBackedActivity;

        // Clean the incoming data.
        const licenceHolderContact = CleaningFunctions.cleanLicenseHolderContact(application);
        address = CleaningFunctions.cleanAddress(application);

        // If we only have a UPRN get the rest of the address.
        if (address.uprn) {
          address = await CleaningFunctions.cleanAddressFromUprn(address.uprn);
        }

        const issue = CleaningFunctions.cleanIssue(application);
        const measure = CleaningFunctions.cleanMeasure(application);

        // If applying on behalf of someone else clean contact details.
        if (application.onBehalf) {
          onBehalfContact = CleaningFunctions.cleanOnBehalfContact(application);
        }

        // If site address is different from licence holder's address clean it.
        if (!application.sameAddressAsLicenceHolder) {
          siteAddress = CleaningFunctions.cleanSiteAddress(application);
        }

        // If we only have a UPRN get the rest of the site's address.
        if (siteAddress?.uprn) {
          siteAddress = await CleaningFunctions.cleanAddressFromUprn(siteAddress.uprn);
        }

        // Clean all the possible species activities.
        if (application.species.herringGull.requiresLicense) {
          herringActivity = CleaningFunctions.cleanActivity(application, 'herringGull');
        }

        if (application.species.blackHeadedGull.requiresLicense) {
          blackHeadedActivity = CleaningFunctions.cleanActivity(application, 'blackHeadedGull');
        }

        if (application.species.commonGull.requiresLicense) {
          commonActivity = CleaningFunctions.cleanActivity(application, 'commonGull');
        }

        if (application.species.greatBlackBackedGull.requiresLicense) {
          greatBlackBackedActivity = CleaningFunctions.cleanActivity(application, 'greatBlackBackedGull');
        }

        if (application.species.lesserBlackBackedGull.requiresLicense) {
          lesserBlackBackedActivity = CleaningFunctions.cleanActivity(application, 'lesserBlackBackedGull');
        }

        // Clean the fields on the application.
        const incomingApplication = CleaningFunctions.cleanApplication(application);

        // Call the controllers create function to write the cleaned data to the DB.
        const newApplication = await Application.create(
          onBehalfContact,
          licenceHolderContact,
          address,
          siteAddress,
          issue,
          herringActivity,
          blackHeadedActivity,
          commonActivity,
          greatBlackBackedActivity,
          lesserBlackBackedActivity,
          measure,
          incomingApplication,
        );

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // If there is a newApplication object and it has the ID property then...
        if (newApplication?.id) {
          // Set a string representation of the ID to this local variable.
          const newAppId = newApplication.id.toString();
          // Construct a new URL object with the baseUrl declared above and the newId.
          const locationUrl = new URL(newAppId, baseUrl);
          // If all is well return the application location and 201 created.
          return h.response(newApplication).location(locationUrl.href).code(201);
        }
      } catch (error: unknown) {
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
];

export default routes;
