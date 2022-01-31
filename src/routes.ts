import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';
import PostcodeLookupController from './controllers/postcode-lookup-controller';
import PostcodeLookup from './models/postcode-lookup';
import Application from './controllers/application';
import License from './controllers/license';
import Note from './controllers/note';
import Advisory from './controllers/advisory';
import Condition from './controllers/condition';
import Assessment from './controllers/assessment';
import CleaningFunctions from './controllers/cleaning-functions';
import config from './config/app';
import JsonUtils from './json-utils';

import jwk from './config/jwk';

/**
 * An array of all the routes and controllers in the app.
 */
const routes: ServerRoute[] = [
  /**
   * "Hello, world!" endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/`,
    handler: (_request: Request, h: ResponseToolkit) => {
      return h.response({message: 'Hello, world!'});
    },
  },
  /**
   * GET all advisories endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/advisories`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const advisories = await Advisory.findAll();

        // Did we get any advisories?
        if (advisories === undefined || advisories === null) {
          return h.response({message: `No advisories found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(advisories).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET all default advisories endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/default-advisories`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const defaultAdvisories = await Advisory.findAllDefault();

        // Did we get any default advisories?
        if (defaultAdvisories === undefined || defaultAdvisories === null) {
          return h.response({message: `No default advisories found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(defaultAdvisories).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET all optional advisories endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/optional-advisories`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const optionalAdvisories = await Advisory.findAllOptional();

        // Did we get any optional advisories?
        if (optionalAdvisories === undefined || optionalAdvisories === null) {
          return h.response({message: `No optional advisories found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(optionalAdvisories).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET all conditions endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/conditions`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const conditions = await Condition.findAll();

        // Did we get any conditions?
        if (conditions === undefined || conditions === null) {
          return h.response({message: `No conditions found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(conditions).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET all default conditions endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/default-conditions`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const defaultConditions = await Condition.findAllDefault();

        // Did we get any default conditions?
        if (defaultConditions === undefined || defaultConditions === null) {
          return h.response({message: `No default conditions found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(defaultConditions).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET all optional conditions endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/optional-conditions`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const optionalConditions = await Condition.findAllOptional();

        // Did we get any optional conditions?
        if (optionalConditions === undefined || optionalConditions === null) {
          return h.response({message: `No optional conditions found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(optionalConditions).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET addresses from postcode lookup service endpoint.
   */
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
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Send back a 500 with a error message
        return h.response({message: 'Invalid postcode.'}).code(500);
      }
    },
  },
  /**
   * GET all (summarized) applications endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/applications`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const applications = await Application.findAllSummary();

        // Did we get any applications?
        if (applications === undefined || applications === null) {
          return h.response({message: `No applications found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(applications).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET single application from ID endpoint.
   */
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
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * POST new application endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Get the payload from the request.
        const application = request.payload as any;

        let onBehalfContact;
        let siteAddress;
        let herringActivity;
        let blackHeadedActivity;
        let commonActivity;
        let greatBlackBackedActivity;
        let lesserBlackBackedActivity;
        let permittedHerringActivity;
        let permittedBlackHeadedActivity;
        let permittedCommonActivity;
        let permittedGreatBlackBackedActivity;
        let permittedLesserBlackBackedActivity;

        // Clean the incoming data.
        const licenceHolderContact = CleaningFunctions.cleanLicenseHolderContact(application);
        const address = CleaningFunctions.cleanAddress(application);

        const issue = CleaningFunctions.cleanIssue(application);
        const measure = CleaningFunctions.cleanMeasure(application);

        // If applying on behalf of someone else clean contact details.
        if (application.onBehalf) {
          onBehalfContact = CleaningFunctions.cleanOnBehalfContact(application);
        }

        // If site address is different from license holder's address clean it.
        if (!application.sameAddressAsLicenceHolder) {
          siteAddress = CleaningFunctions.cleanSiteAddress(application);
        }

        // Clean all the possible species activities.
        if (application.species.herringGull.requiresLicense) {
          herringActivity = CleaningFunctions.cleanActivity(application, 'herringGull');
          permittedHerringActivity = CleaningFunctions.cleanPermittedActivity(application, 'herringGull');
        }

        if (application.species.blackHeadedGull.requiresLicense) {
          blackHeadedActivity = CleaningFunctions.cleanActivity(application, 'blackHeadedGull');
          permittedBlackHeadedActivity = CleaningFunctions.cleanPermittedActivity(application, 'blackHeadedGull');
        }

        if (application.species.commonGull.requiresLicense) {
          commonActivity = CleaningFunctions.cleanActivity(application, 'commonGull');
          permittedCommonActivity = CleaningFunctions.cleanPermittedActivity(application, 'commonGull');
        }

        if (application.species.greatBlackBackedGull.requiresLicense) {
          greatBlackBackedActivity = CleaningFunctions.cleanActivity(application, 'greatBlackBackedGull');
          permittedGreatBlackBackedActivity = CleaningFunctions.cleanPermittedActivity(
            application,
            'greatBlackBackedGull',
          );
        }

        if (application.species.lesserBlackBackedGull.requiresLicense) {
          lesserBlackBackedActivity = CleaningFunctions.cleanActivity(application, 'lesserBlackBackedGull');
          permittedLesserBlackBackedActivity = CleaningFunctions.cleanPermittedActivity(
            application,
            'lesserBlackBackedGull',
          );
        }

        // Clean the fields on the application.
        const incomingApplication = CleaningFunctions.cleanApplication(application);

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // Grab the 'forwarding' url from the request.
        const {confirmBaseUrl} = request.query;

        // Check there's actually one there, otherwise we'll have to make one up.
        const urlInvalid = confirmBaseUrl === undefined || confirmBaseUrl === null;

        // Call the controllers create function to write the cleaned data to the DB.
        const newApplication: any = await Application.create(
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
          permittedHerringActivity,
          permittedBlackHeadedActivity,
          permittedCommonActivity,
          permittedGreatBlackBackedActivity,
          permittedLesserBlackBackedActivity,
          measure,
          incomingApplication,
          urlInvalid ? `${baseUrl.toString()}confirm?token=` : confirmBaseUrl,
        );

        // If there is a newApplication object and it has the ID property then...
        if (newApplication?.id) {
          // Set a string representation of the ID to this local variable.
          const newAppId = newApplication.id.toString();
          // Construct a new URL object with the baseUrl declared above and the newId.
          const locationUrl = new URL(newAppId, baseUrl);
          // If all is well return the application, location and 201 created.
          return h.response(newApplication).location(locationUrl.href).code(201);
        }

        // If we get here the application was not created successfully.
        return h.response({message: `Failed to create application.`}).code(500);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * PATCH application confirmed endpoint.
   */
  {
    method: 'patch',
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

        // Did we get an application that has already been confirmed?
        if (application.confirmedByLicenseHolder) {
          return h.response({message: `Application ${existingId} has already been confirmed.`}).code(400);
        }

        // Update the application in the database with confirmedByLicenseHolder set to true.
        const confirmApplication: any = request.payload as any;
        const updatedApplication = await Application.confirm(existingId, confirmApplication);

        // If they're not successful, send a 500 error.
        if (updatedApplication === undefined) {
          return h.response({message: `Could not update application ${existingId}.`}).code(500);
        }

        // If they are, send back the updated fields.
        return h.response().code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * DELETEs a single application and all child records (withdraw).
   */
  {
    method: 'delete',
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

        // Try to get the requested licence sd we can only withdraw a application if the license hasn't been issued.
        const licence = await License.findOne(existingId);
        // Did we get an License?
        if (licence) {
          return h.response({message: `Licence ${existingId} has already been issued you need to revoke.`}).code(400);
        }

        // Get the payload from the request.
        const withdrawal = request.payload as any;
        // Clean up the user's input before we store it in the database.
        const cleanObject = CleaningFunctions.cleanWithdrawOrRevokeInput(existingId, withdrawal);
        // Attempt to delete the application and all child records.
        const withdrawApplication = await Application.withdraw(existingId, cleanObject);

        // If we were unable to delete the application we need to return a 500 with a suitable error message.
        if (!withdrawApplication) {
          return h.response({message: `Could not withdraw application ${existingId}.`}).code(500);
        }

        // If we were able to delete the application we need to return a 200.
        return h.response().code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * Soft DELETEs a single licence and all child records (revoke).
   */
  {
    method: 'delete',
    path: `${config.pathPrefix}/application/{id}/revoke`,
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

        // Try to get the requested licence sd we can only revoke a licence.
        const licence = await License.findOne(existingId);
        // Did we get an application?
        if (licence === undefined || licence === null) {
          return h
            .response({
              message: `Licence ${existingId} not found so you will need to withdraw the application instead.`,
            })
            .code(404);
        }

        // Get the payload from the request.
        const revocation = request.payload as any;
        // Clean up the user's input before we store it in the database.
        const cleanObject = CleaningFunctions.cleanWithdrawOrRevokeInput(existingId, revocation);
        // Attempt to delete the application and all child records.
        const deleteApplication = await Application.delete(existingId, cleanObject);

        // If we were unable to delete the application we need to return a 500 with a suitable error message.
        if (!deleteApplication) {
          return h.response({message: `Could not revoke application ${existingId}.`}).code(500);
        }

        // If we were able to delete the application we need to return a 200.
        return h.response().code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * PATCH application confirmed endpoint.
   */
  {
    method: 'patch',
    path: `${config.pathPrefix}/application/{id}/assign`,
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

        // Update the application in the database with staff number.
        const assignTo: any = request.payload as any;

        // Did we get an application that has already been confirmed?
        if (application.staffNumber && assignTo.staffNumber !== null) {
          return h.response({message: `Application ${existingId} has already been assigned.`}).code(400);
        }

        const updatedApplication = await Application.assign(existingId, assignTo);

        // If they're not successful, send a 500 error.
        if (updatedApplication === undefined) {
          return h.response({message: `Could not update application ${existingId}.`}).code(500);
        }

        // If they are, send back the updated fields.
        return h.response().code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * PATCH application assessment endpoint.
   */
  {
    method: 'patch',
    path: `${config.pathPrefix}/application/{id}/assessment`,
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

        // Clean the fields on the applications assessment.
        const incomingAssessment = CleaningFunctions.cleanAssessment(request.payload as any);

        // Upsert the assessment.
        const assessment = await Assessment.upsert(incomingAssessment, existingId);

        // If they're not successful, send a 500 error.
        if (!assessment) {
          return h
            .response({message: `Could not update or create the assessment for application ${existingId}.`})
            .code(500);
        }

        // If they are, send back the updated fields.
        return h.response().code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * POST new license endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/license`,
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

        const assessment = await Assessment.findOne(existingId);
        // Did we assess the application?
        if (assessment === undefined || assessment === null) {
          return h.response({message: `Application ${existingId} has not been assessed.`}).code(404);
        }

        if (!assessment.decision) {
          return h
            .response({message: `Application ${existingId} can not be issued as a license as it was not approved.`})
            .code(404);
        }

        // Get the payload from the request.
        const license = request.payload as any;

        const optionalConditions = await CleaningFunctions.cleanCondition(license);
        const optionalAdvisories = await CleaningFunctions.cleanAdvisory(license);

        // Clean the fields on the license.
        const incomingLicense = CleaningFunctions.cleanLicense(license);

        // Call the controllers create function to write the cleaned data to the DB.
        const newLicense: any = await License.create(
          existingId,
          optionalConditions,
          optionalAdvisories,
          incomingLicense,
        );

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // If there is a newLicense object and it has the ApplicationId property then...
        if (newLicense?.ApplicationId) {
          // Set a string representation of the ID to this local variable.
          const newLicenseId = newLicense.ApplicationId.toString();
          // Construct a new URL object with the baseUrl declared above and the newId.
          const locationUrl = new URL(newLicenseId, baseUrl);
          // If all is well return the License, location and 201 created.
          return h.response(newLicense).location(locationUrl.href).code(201);
        }

        // If we get here the License was not created successfully.
        return h.response({message: `Failed to create License.`}).code(500);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * POST new application note endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/note`,
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

        // Get the payload from the request.
        const note = request.payload as any;

        // Clean the fields on the note.
        const incomingNote = CleaningFunctions.cleanNote(note);

        // Call the controllers create function to write the cleaned data to the DB.
        const newNote: any = await Note.create(existingId, incomingNote);

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // If there is a newNote object and it has the ApplicationId property then...
        if (newNote?.ApplicationId) {
          // Set a string representation of the ID to this local variable.
          const newNoteId = newNote.ApplicationId.toString();
          // Construct a new URL object with the baseUrl declared above and the newId.
          const locationUrl = new URL(newNoteId, baseUrl);
          // If all is well return the Note, location and 201 created.
          return h.response(newNote).location(locationUrl.href).code(201);
        }

        // If we get here the Note was not created successfully.
        return h.response({message: `Failed to create Application Note.`}).code(500);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
  /**
   * GET the public part of our elliptic curve JWK.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/public-key`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Grab a copy of our public key.
        const publicKey = await jwk.getPublicKey({type: 'jwk'});

        // Send it to the client.
        return h.response(publicKey).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));

        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },
];

export default routes;
