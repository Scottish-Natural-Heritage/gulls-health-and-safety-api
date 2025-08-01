import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';
import PostcodeLookupController from './controllers/postcode-lookup-controller';
import PostcodeLookup from './models/postcode-lookup';
import Application from './controllers/application';
import License from './controllers/license';
import Amendment from './controllers/amendment';
import Note from './controllers/note';
import Advisory from './controllers/advisory';
import Condition from './controllers/condition';
import Assessment from './controllers/assessment';
import PActivity from './controllers/p-activity';
import Contact from './controllers/contact';
import Returns from './controllers/returns';
import CleaningFunctions from './controllers/cleaning-functions';
import Scheduled from './controllers/scheduled';
import Address from './controllers/address';
import config from './config/app';
import JsonUtils from './json-utils';
import jwk from './config/jwk.js';
import UploadedImage from './controllers/uploaded-image';

/**
 * Checks if an array of returns contains a final return.
 *
 * @param {any} returns The array of returns to check.
 * @returns {boolean} Returns `true` if a final return is found, else
 * returns `false`.
 */
const hasFinalReturn = (returns: any): boolean => {
  for (const currentReturn of returns) {
    if (currentReturn.isFinalReturn) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if an array of returns contains a truthy PActivity of eggDestruction or removeNests.
 *
 * @param {any} species The array of species to check.
 * @returns {boolean} Returns `true` if a final return is found, else
 * returns `false`.
 */
const checkForValidActivities = (species: any): boolean => {
  if (species?.PBlackHeadedGull?.eggDestruction || species?.PBlackHeadedGull?.removeNests) {
    return true;
  }

  if (species?.PHerringGull?.eggDestruction || species?.PHerringGull?.removeNests) {
    return true;
  }

  if (species?.PCommonGull?.eggDestruction || species?.PCommonGull?.removeNests) {
    return true;
  }

  if (species?.PGreatBlackBackedGull?.eggDestruction || species?.PGreatBlackBackedGull?.removeNests) {
    return true;
  }

  if (species?.PLesserBlackBackedGull?.eggDestruction || species?.PLesserBlackBackedGull?.removeNests) {
    return true;
  }

  return false;
};

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
   * GET all paginated (summarized) applications endpoint and with an optional search term applied.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/applications`,
    handler: async (request: Request, h: ResponseToolkit) => {
      const page = Number.parseInt(request.query.page as string, 10) || 1;

      /**
       * The number of items to display per page on the Gulls Staff search screen.
       */
      const itemsPerPage = 10;

      try {
        const {count, rows} = await Application.findAllPaginatedSummary(request, itemsPerPage);

        const responseData = {
          pageNumber: page,
          pageSize: itemsPerPage,
          recordsCount: count,
          records: rows,
        };

        // Did we get any applications?
        if (rows === undefined || rows === null || count === undefined || count === null) {
          return h.response({message: `No applications found.`}).code(404);
        }

        // If we get here we have something to return, so return it.
        return h.response(responseData).code(200);
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
   * GET single application contact from ID endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/application/{id}/contact/{contactId}`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Is the contactId a number?
        const existingContactId = Number(request.params.contactId);
        if (Number.isNaN(existingContactId)) {
          return h.response({message: `Contact ${existingContactId} not valid.`}).code(404);
        }

        // Try to get the requested application.
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        // Try to get the requested contact.
        const contact = await Contact.findOne(existingContactId);

        // Did we get a contact?
        if (contact === undefined || contact === null) {
          return h.response({message: `Contact ${existingContactId} not found.`}).code(404);
        }

        // Return the contact record.
        return h.response(contact).code(200);
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
   * POST gulls return authentication endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/login`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Grab the ID?
        const existingId = request.params.id;

        // Get the payload from the request.
        const authentication = request.payload as any;

        // Clean the fields on the authentication process.
        const incomingAuthentication = CleaningFunctions.cleanAuthenticationInfo(authentication, existingId);

        // Try to get the requested application.
        const application: any = await Application.findOne(incomingAuthentication.licenceNumber);

        // Try to get the requested licence.
        const licence: any = await License.findOne(incomingAuthentication.licenceNumber);

        // Do a check to see that the postcode entered matches the sites.
        const postcodeMatches = application
          ? application?.SiteAddress?.postcode === incomingAuthentication.postcode
          : undefined;

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // Grab the 'forwarding' url from the request.
        const {redirectBaseUrl} = request.query;

        // Check there's actually one there, otherwise we'll have to make one up.
        const urlInvalid = redirectBaseUrl === undefined || redirectBaseUrl === null;

        // Save the magicLinkUrl.
        const magicLinkBaseUrl = urlInvalid ? `${baseUrl.toString()}start?token=` : redirectBaseUrl;

        if (application && licence && postcodeMatches) {
          // Try send the magic link email.
          await Application.login(incomingAuthentication, application, magicLinkBaseUrl);
        }

        // Return a 200 regardless of if the email was sent or not.
        return h.response().code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? But as this is an authentication process then we should just return a 200 with no error.
        return h.response().code(200);
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

        // Did we get an application that has already been confirmed? if so just return OK
        if (application.confirmedByLicenseHolder) {
          return h.response().code(200);
        }

        // Update the application in the database with confirmedByLicenseHolder set to true.
        const confirmApplication: any = request.payload as any;
        confirmApplication.confirmedAt = new Date();
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
   * PATCH application contact endpoint.
   */
  {
    method: 'patch',
    path: `${config.pathPrefix}/application/{id}/contact/{contactId}`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Is the contactId a number?
        const existingContactId = Number(request.params.contactId);
        if (Number.isNaN(existingContactId)) {
          return h.response({message: `Contact ${existingContactId} not valid.`}).code(404);
        }

        // Try to get the requested application.
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        // Try to get the requested contact.
        const contact = await Contact.findOne(existingContactId);

        // Did we get a contact?
        if (contact === undefined || contact === null) {
          return h.response({message: `Contact ${existingContactId} not found.`}).code(404);
        }

        // Clean the fields on the applications contact record.
        const incomingContactChange = await CleaningFunctions.cleanContact(request.payload as any);

        // Update the contact.
        const contactChange = await Contact.update(existingContactId, incomingContactChange);

        // If they're not successful, send a 500 error.
        if (!contactChange) {
          return h
            .response({
              message: `Could not update contact ${existingContactId} for application ${existingId}.`,
            })
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
   * Send a 14 day reminder endpoint.
   */
  {
    method: 'patch',
    path: `${config.pathPrefix}/reminder`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Try to get the requested application.
        const applications = await Scheduled.getUnconfirmed();

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // Create the confirm magic link base URL.
        const confirmBaseUrl = `${config.hostPrefix}${String(request.query.onBehalfApprovePath)}`;

        // Check there's actually one there, otherwise we'll have to make one up.
        const urlInvalid = confirmBaseUrl === undefined || confirmBaseUrl === null;

        const unconfirmed: any = await Scheduled.checkUnconfirmedAndSendReminder(
          applications,
          urlInvalid ? `${baseUrl.toString()}confirm?token=` : confirmBaseUrl,
        );

        if (unconfirmed) {
          for (const application of unconfirmed) {
            const sentReminder: any = {fourteenDayReminder: true};
            // The await is needed here as we have an indeterminate number of unconfirmed to update in the DB.
            // eslint-disable-next-line no-await-in-loop
            await Application.remind(application.id, sentReminder);
          }
        }

        return h.response({message: 'Reminders sent for applications unconfirmed after 14 days.'}).code(200);
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

        // Try to get the requested licence so we can only withdraw an application if the licence hasn't been issued.
        const licence = await License.findOne(existingId);
        // Did we get a licence?
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
   * Withdraw application endpoint.
   */
  {
    method: 'delete',
    path: `${config.pathPrefix}/withdrawal`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Try to get any unconfirmed but reminded applications.
        const applications = await Scheduled.getUnconfirmedReminded();

        const unconfirmed: any = await Scheduled.checkUnconfirmedAndWithdraw(applications);

        // If we have undefined confirmed no applications needed to be withdrawn.
        if (unconfirmed === undefined) {
          return h.response({message: 'No unconfirmed applications older than 21 days exist.'}).code(200);
        }

        for (const application of unconfirmed) {
          const withdrawalReason = {
            ApplicationId: application.id,
            reason: 'Application unconfirmed after 21 days.',
            createdBy: 'node-cron automated process',
          };
          // Disabled as we need to loop through the list of applications to withdraw.
          // eslint-disable-next-line no-await-in-loop
          await Application.withdraw(application.id, withdrawalReason);
        }

        // Return something here.
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
   * PATCH application assign endpoint.
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

        const incomingAdditionalMeasures = CleaningFunctions.cleanAdditionalMeasure(request.payload as any);

        // If we already have an assessment measure entry we need it's ID to upsert the new values,
        // so cast the application first so we can access the AssessmentMeasure object.
        const assessmentMeasure = application;

        let assessmentMeasureId;

        if (assessmentMeasure?.AssessmentMeasure && incomingAdditionalMeasures) {
          assessmentMeasureId = assessmentMeasure.AssessmentMeasure.id;
          incomingAdditionalMeasures.id = assessmentMeasureId;
        }

        // Upsert the assessment.
        const assessment = await Assessment.upsert(incomingAssessment, existingId, incomingAdditionalMeasures);

        // If they're not successful, send a 500 error.
        if (!assessment) {
          return h
            .response({message: `Could not update or create the assessment for application ${existingId}.`})
            .code(500);
        }

        if (incomingAssessment.decision !== undefined && incomingAssessment.decision === false) {
          // Call the controller to send the email.
          await Application.setRefusalEmail(existingId);
        }

        // If they are successful, send back the updated fields and send email.
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
   * GET single application from ID endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/application/{id}/permitted-activity/{activityId}`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Is the activityId a number?
        const existingActivityId = Number(request.params.activityId);
        if (Number.isNaN(existingActivityId)) {
          return h.response({message: `Permitted Activity ${existingActivityId} not valid.`}).code(404);
        }

        // Try to get the requested application.
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        // Try to get the requested permitted activity.
        const permittedActivity = await PActivity.findOne(existingActivityId);

        // Did we get an permitted activity?
        if (permittedActivity === undefined || permittedActivity === null) {
          return h.response({message: `Permitted Activity ${existingActivityId} not found.`}).code(404);
        }

        // Return the permittedActivity record.
        return h.response(permittedActivity).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * PATCH application permitted activity endpoint.
   */
  {
    method: 'patch',
    path: `${config.pathPrefix}/application/{id}/permitted-activity/{activityId}`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Is the activityId a number?
        const existingActivityId = Number(request.params.activityId);
        if (Number.isNaN(existingActivityId)) {
          return h.response({message: `Permitted Activity ${existingActivityId} not valid.`}).code(404);
        }

        // Try to get the requested application.
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        // Try to get the requested permitted activity.
        const permittedActivity = await PActivity.findOne(existingActivityId);

        // Did we get an permitted activity?
        if (permittedActivity === undefined || permittedActivity === null) {
          return h.response({message: `Permitted Activity ${existingActivityId} not found.`}).code(404);
        }

        // Clean the fields on the applications permitted activity record.
        const incomingPermittedActivityChange = await CleaningFunctions.cleanPermittedActivityChange(
          request.payload as any,
        );

        // Update the permitted activity.
        const permittedActivityChange = await PActivity.update(existingActivityId, incomingPermittedActivityChange);

        // If they're not successful, send a 500 error.
        if (!permittedActivityChange) {
          return h
            .response({
              message: `Could not update permitted activity ${existingActivityId} for application ${existingId}.`,
            })
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

        if (!application.confirmedByLicenseHolder) {
          return h
            .response({
              message: `Application ${existingId} has still to be confirmed by the license holder, you can not issue license until they confirm.`,
            })
            .code(400);
        }

        const assessment = await Assessment.findOne(existingId);
        // Did we assess the application?
        if (assessment === undefined || assessment === null) {
          return h.response({message: `Application ${existingId} has not been assessed.`}).code(400);
        }

        if (assessment.decision === undefined || assessment.decision === null) {
          return h
            .response({
              message: `Application ${existingId} can not be issued as a license as it has no assessment decision has been made.`,
            })
            .code(400);
        }

        if (!assessment.decision) {
          return h
            .response({message: `Application ${existingId} can not be issued as a license as it was not approved.`})
            .code(400);
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
   * POST resend license emails endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/license/resend`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Try to get the requested License.
        const license = await License.findOne(existingId);
        // Did we issue the license?
        if (license === undefined || license === null) {
          return h.response({message: `A Licence for Application ${existingId} has not been issued yet.`}).code(400);
        }

        // Call the controllers to resend the emails.
        await License.reSendEmails(existingId);

        // Return a 200 response if the emails were sent successfully.
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
   * POST new return endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/return`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Licence number ${existingId} not valid.`}).code(404);
        }

        // Try to get the license to which the return pertains.
        const license = await License.findOne(existingId);
        // Did we issue the license?
        if (license === undefined || license === null) {
          return h.response({message: `A License for Application ${existingId} has not been issued yet.`}).code(400);
        }

        // Get the new return from the request's payload.
        const newReturn = request.payload as any;

        let herringReturn;
        let blackHeadedReturn;
        let commonReturn;
        let greatBlackBackedReturn;
        let lesserBlackBackedReturn;

        // Clean the return before we try to insert it into the database.
        const cleanedReturn = CleaningFunctions.cleanReturn(newReturn);

        // Set the licence ID to be used as the foreign key.
        cleanedReturn.LicenceId = existingId;
        if (newReturn.isReportingReturn) {
          // Clean all the possible return species activities.
          if (newReturn.species.herringGull.hasReturn) {
            herringReturn = CleaningFunctions.cleanReturnActivity(newReturn, 'herringGull');
          }

          if (newReturn.species.blackHeadedGull.hasReturn) {
            blackHeadedReturn = CleaningFunctions.cleanReturnActivity(newReturn, 'blackHeadedGull');
          }

          if (newReturn.species.commonGull.hasReturn) {
            commonReturn = CleaningFunctions.cleanReturnActivity(newReturn, 'commonGull');
          }

          if (newReturn.species.greatBlackBackedGull.hasReturn) {
            greatBlackBackedReturn = CleaningFunctions.cleanReturnActivity(newReturn, 'greatBlackBackedGull');
          }

          if (newReturn.species.lesserBlackBackedGull.hasReturn) {
            lesserBlackBackedReturn = CleaningFunctions.cleanReturnActivity(newReturn, 'lesserBlackBackedGull');
          }
        }

        // Try to add the return to the database.
        const insertedReturn: any = await Returns.create(
          cleanedReturn,
          herringReturn,
          blackHeadedReturn,
          commonReturn,
          greatBlackBackedReturn,
          lesserBlackBackedReturn,
        );

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // If there is an insertedReturn object and it has the ID property then...
        if (insertedReturn?.id) {
          // Set a string representation of the ID to this local variable.
          const newReturnId = insertedReturn.id.toString();
          // Construct a new URL object with the baseUrl declared above and the newReturnId.
          const locationUrl = new URL(newReturnId, baseUrl);
          // If all is well return the return, location and 201 created.
          return h.response(insertedReturn).location(locationUrl.href).code(201);
        }

        // If we get here the return was not created successfully.
        return h.response({message: `Failed to create return.`}).code(500);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * GET all licence Returns from ID endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/application/{id}/return`,
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

        // Try to get all the returns.
        const gullReturns = await Returns.findAllForLicence(existingId);

        // Did we get any returns?
        if (gullReturns === undefined || gullReturns === null) {
          return h.response({message: `No returns found.`}).code(404);
        }

        // Return the gullReturns.
        return h.response(gullReturns).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * GET single licence Return from ID endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/application/{id}/return/{returnId}`,
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

        // Is the returnId a number?
        const existingReturnId = Number(request.params.returnId);
        if (Number.isNaN(existingReturnId)) {
          return h.response({message: `Return ${existingReturnId} not valid.`}).code(404);
        }

        // Try to get the requested return.
        const gullReturn = await Returns.findOne(existingReturnId);

        // Did we get an return?
        if (gullReturn === undefined || gullReturn === null) {
          return h.response({message: `Return ${existingReturnId} not found.`}).code(404);
        }

        // Return the gullReturn.
        return h.response(gullReturn).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * POST an amendment.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/amendment`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Licence number ${existingId} not valid.`}).code(404);
        }

        // Try to get the license to which the amendment pertains.
        const license = await License.findOne(existingId);
        // Did we issue the license?
        if (license === undefined || license === null) {
          return h.response({message: `A License for Application ${existingId} has not been issued yet.`}).code(400);
        }

        // Get the new return from the request's payload.
        const newAmendment = request.payload as any;

        let herringAmend;
        let blackHeadedAmend;
        let commonAmend;
        let greatBlackBackedAmend;
        let lesserBlackBackedAmend;

        // Clean the return before we try to insert it into the database.
        const cleanedAmendment = CleaningFunctions.cleanAmendment(newAmendment);

        // If we have a licence we'll need the email address of the licence holder to send an amended email.
        const application = await Application.findOne(existingId);
        cleanedAmendment.licenceHolderEmailAddress = application.LicenceHolder?.emailAddress;
        cleanedAmendment.licenceApplicantEmailAddress = application.LicenceApplicant?.emailAddress;

        // Concatenate conditions before cleaning.
        newAmendment.conditions = [...newAmendment.whatYouMustDo, ...newAmendment.general, ...newAmendment.reporting];

        // We need to do this to reuse cleaning function.
        newAmendment.advisories = newAmendment.advisoryNotes;

        const optionalConditions = await CleaningFunctions.cleanCondition(newAmendment);
        const optionalAdvisories = await CleaningFunctions.cleanAdvisory(newAmendment);

        // Set the licence ID to be used as the foreign key.
        cleanedAmendment.LicenceId = existingId;

        // Clean all the possible amended species activities.
        if (newAmendment.amendSpecies.herringGull.hasAmend) {
          herringAmend = CleaningFunctions.cleanAmendActivity(newAmendment, 'herringGull');
        }

        if (newAmendment.amendSpecies.blackHeadedGull.hasAmend) {
          blackHeadedAmend = CleaningFunctions.cleanAmendActivity(newAmendment, 'blackHeadedGull');
        }

        if (newAmendment.amendSpecies.commonGull.hasAmend) {
          commonAmend = CleaningFunctions.cleanAmendActivity(newAmendment, 'commonGull');
        }

        if (newAmendment.amendSpecies.greatBlackBackedGull.hasAmend) {
          greatBlackBackedAmend = CleaningFunctions.cleanAmendActivity(newAmendment, 'greatBlackBackedGull');
        }

        if (newAmendment.amendSpecies.lesserBlackBackedGull.hasAmend) {
          lesserBlackBackedAmend = CleaningFunctions.cleanAmendActivity(newAmendment, 'lesserBlackBackedGull');
        }

        // Try to add the amendment to the database.
        const insertedAmendment: any = await Amendment.create(
          cleanedAmendment,
          herringAmend,
          blackHeadedAmend,
          commonAmend,
          greatBlackBackedAmend,
          lesserBlackBackedAmend,
          optionalConditions,
          optionalAdvisories,
        );

        // Create baseUrl.
        const baseUrl = new URL(
          `${request.url.protocol}${request.url.hostname}:${3017}${request.url.pathname}${
            request.url.pathname.endsWith('/') ? '' : '/'
          }`,
        );

        // If there is an insertedAmendment object and it has the ID property then...
        if (insertedAmendment?.id) {
          // Set a string representation of the ID to this local variable.
          const newAmendmentId = insertedAmendment.id.toString();
          // Construct a new URL object with the baseUrl declared above and the newAmendmentId.
          const locationUrl = new URL(newAmendmentId, baseUrl);
          // If all is well return the amendment, location and 201 created.
          return h.response(insertedAmendment).location(locationUrl.href).code(201);
        }

        // If we get here the amendment was not created successfully.
        return h.response({message: `Failed to create amendment.`}).code(500);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * GET all licence Amendments from ID endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/application/{id}/amendment`,
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

        // Try to get all the returns.
        const amendments = await Amendment.findAllForLicence(existingId);

        // Did we get any amendments?
        if (amendments === undefined || amendments === null) {
          return h.response({message: `No amendments found.`}).code(404);
        }

        // Return the gullReturns.
        return h.response(amendments).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * GET single licence amendment from ID endpoint.
   */
  {
    method: 'get',
    path: `${config.pathPrefix}/application/{id}/amendment/{amendId}`,
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

        // Is the amendId a number?
        const existingAmendId = Number(request.params.amendId);
        if (Number.isNaN(existingAmendId)) {
          return h.response({message: `Amendment ${existingAmendId} not valid.`}).code(404);
        }

        // Try to get the requested amendment.
        const amendment = await Amendment.findOne(existingAmendId);

        // Did we get an amendment?
        if (amendment === undefined || amendment === null) {
          return h.response({message: `Amendment ${existingAmendId} not found.`}).code(404);
        }

        // Return the amendment.
        return h.response(amendment).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * POST resend amendment emails endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/amendment/{amendId}/resend`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the application ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Is the amendment ID a number?
        const amendmentId = Number(request.params.amendId);
        if (Number.isNaN(amendmentId)) {
          return h.response({message: `Amendment ${existingId} not valid.`}).code(404);
        }

        // Call the amendment controller and ask it to resend the amendment email.
        await Amendment.resendAmendmentEmail(existingId, amendmentId);

        // Return a 200 response if the emails were sent successfully.
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
   * POST application additional species endpoint.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/add-additional-species`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Try to get the requested application to retrieve a permitted application (not a bogus app no)
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        // Get the new activity from the request's payload.
        const newIncomingSpeciesActivity = request.payload as any;

        // Clean the fields on the incoming activity.
        const incomingActivity = await CleaningFunctions.cleanNewPermittedActivity(newIncomingSpeciesActivity);

        // Add the the fields on the applications permitted activity record.
        const updateAndAddSpecies = await Application.addNewSpecies(
          incomingActivity,
          newIncomingSpeciesActivity.speciesType,
          application.PermittedSpeciesId,
        );

        // If they're not successful, send a 500 error.
        if (!updateAndAddSpecies) {
          return h.response({message: `Could not add additional species to application ${existingId}.`}).code(500);
        }

        // If all is well return 201 created.
        return h.response().code(201);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * Resend licences issued before test 3 deployment.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/resend-licences`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Try to get any applications submitted before 20th May 2022.
        const applications = await Scheduled.getPreTest3Applications();

        // Filter out non-licences or revoked licences.
        const filteredLicences = applications.filter((application: any) => {
          return application.License !== null && application.Revocation === null;
        });

        // Call the scheduled controller's resendEmails function.
        const resentLicences = await Scheduled.resendLicenceEmails(filteredLicences);

        return h.response({message: `Resent ${resentLicences} licences.`}).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * Send out a reminder email on expired licences with no returns, on
   * the 1st of March and the 1st of April.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/expired-no-return-reminder`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // We need to know the date and year.
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Fetch all applications to be filtered.
        const applications = await Scheduled.getApplications();

        // Filter out any non-licences, non-expired licences, or licences with returns.
        const filteredLicences = applications.filter((application: any) => {
          return (
            application.License !== null &&
            new Date(application.License?.periodTo).getFullYear() === currentYear &&
            application.License.periodTo < currentDate &&
            application.License?.Returns.length === 0
          );
        });

        // Try to send out reminder emails.
        const emailsSent = await Scheduled.sendReturnReminder(filteredLicences, 'expiredNoReturn');

        return h.response({message: `Sent ${emailsSent} expired licence with no return reminder emails.`}).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * Send out a reminder email to active licenses older than 3 weeks which have not sent a return.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/return-reminder-current-season`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // We need to know the date.
        const currentDate = new Date();

        // Today's date minus 21 days.
        const currentDateMinusTwentyOneDays: Date = new Date(new Date().setDate(new Date().getDate() - 21));

        // Fetch all applications to be filtered.
        const applications = await Scheduled.findAllApplicantsNoReturnCurrentSeason();

        // Filter out any non-licences, non-expired licences, or licences with returns.
        const filteredLicences = applications.filter((application: any) => {
          return (
            // Checks valid licence
            application.License !== null &&
            // Checks active licence
            application.License?.periodTo > currentDate &&
            // Checks it was created more than 3 weeks ago
            new Date(application.License?.periodFrom) <= currentDateMinusTwentyOneDays &&
            // No returns
            application.License?.Returns.length === 0 &&
            // No revoked or withdrawn licenses
            application.Revocation === null &&
            // Checks valid PActivity criteria of eggDestruction or removeNests
            checkForValidActivities(application?.PSpecies)
          );
        });

        // Try to send out reminder emails.
        const emailsSent = await Scheduled.sendReturnReminder(filteredLicences, 'threeWeeksInNoReturn');

        return h
          .response({
            message: `Sent ${emailsSent} return reminder to licences which are least 3 weeks old and have not yet submitted a return.`,
          })
          .code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * Send out a reminder email on expired licences with returns but no
   * final return, on the 1st of March and the 1st of April.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/expired-no-final-return-reminder`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // We need to know the date and year.
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Fetch all applications to be filtered.
        const applications = await Scheduled.getApplications();

        // Filter out any non-licences, non-expired licences, or licences with final returns.
        const filteredLicences = applications.filter((application: any) => {
          return (
            application.License !== null &&
            new Date(application.License?.periodTo).getFullYear() === currentYear &&
            application.License.periodTo < currentDate &&
            application.License?.Returns.length > 0 &&
            !hasFinalReturn(application.License.Returns)
          );
        });

        // Try to send out reminder emails.
        const emailsSent = await Scheduled.sendReturnReminder(filteredLicences, 'expiredNoFinalReturn');

        return h
          .response({message: `Sent ${emailsSent} expired licence with no final return reminder emails.`})
          .code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * Send out a reminder email on valid licences that are due to expire.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/soon-to-expire-return-reminder`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // We need to know the date and year.
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Fetch all applications to be filtered.
        const applications = await Scheduled.getApplications();

        // Filter out any expired, withdrawn, revoked or previous years' licences.
        const filteredLicences = applications.filter((application: any) => {
          return (
            application.License !== null &&
            application.Withdrawal === null &&
            application.Revocation === null &&
            new Date(application.License?.periodTo).getFullYear() === currentYear &&
            application.License.periodTo > currentDate
          );
        });

        // Try to send out reminder emails.
        const emailsSent = await Scheduled.sendReturnReminder(filteredLicences, 'dueToExpire');

        return h.response({message: `Sent ${emailsSent} soon to expire licence return reminder emails.`}).code(200);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * POST new licence holder address.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/address`,
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

        // Are the licence holder's address and site address different? We only want to create a
        // new address record if they're the same. Otherwise we should patch the existing licence
        // holder's address.
        if (application.LicenceHolderAddressId !== application.SiteAddressId) {
          return h.response({message: `Licence holder address and site address are different`}).code(400);
        }

        // Clean the incoming request's fields.
        const address = await CleaningFunctions.cleanEditAddress(request.payload as any);

        // Create the new address entry.
        const newAddress = await Address.create(address, existingId);

        // Check if the new address was correctly added to the DB.
        if (newAddress === undefined || newAddress === null) {
          return h.response({message: `Failed to create new address in database`}).code(500);
        }

        // If we make it here all is good, return 201 created and the new address object.
        return h.response(newAddress).code(201);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * PATCH existing licence holder address.
   */
  {
    method: 'patch',
    path: `${config.pathPrefix}/application/{id}/address/{addressId}`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Is the address ID a number?
        const existingAddressId = Number(request.params.addressId);
        if (Number.isNaN(existingAddressId)) {
          return h.response({message: `Address ${existingId} not valid.`}).code(404);
        }

        // Try to get the requested application.
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        // Try to get the requested address.
        const address = await Address.findOne(existingAddressId);

        // Did we get an address?
        if (address === undefined || address === null) {
          return h.response({message: `Address ${existingAddressId} not found.`}).code(404);
        }

        // Clean the request payload into an address object the DB can use.
        const cleanedAddress = await CleaningFunctions.cleanEditAddress(request.payload as any);

        // Update the existing address row.
        const editedAddress = await Address.update(cleanedAddress, existingAddressId);

        // Check if the new address was correctly added to the DB.
        if (editedAddress === undefined || editedAddress === null) {
          return h.response({message: `Failed to update address ${existingAddressId} in database`}).code(500);
        }

        // If we make it here all is good, return 20 OK and the updated address object.
        return h.response(editedAddress).code(200);
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

  /**
   * POST image.
   */
  {
    method: 'post',
    path: `${config.pathPrefix}/application/{id}/image`,
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

        const payload = request.payload as {filename: string[]};

        const uploadedImages = await Promise.all(
          payload.filename.map(async (filename) => {
            return UploadedImage.create(existingId, filename);
          }),
        );

        return h.response(uploadedImages).code(201);
      } catch (error: unknown) {
        // Log any error.
        request.logger.error(JsonUtils.unErrorJson(error));
        // Something bad happened? Return 500 and the error.
        return h.response({error}).code(500);
      }
    },
  },

  /**
   * DELETE image.
   */
  {
    method: 'delete',
    path: `${config.pathPrefix}/application/{id}/image/{imageId}`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        // Is the ID a number?
        const existingId = Number(request.params.id);
        const imageId = Number(request.params.imageId);
        if (Number.isNaN(existingId)) {
          return h.response({message: `Application ${existingId} not valid.`}).code(404);
        }

        // Try to get the requested application.
        const application = await Application.findOne(existingId);

        // Did we get an application?
        if (application === undefined || application === null) {
          return h.response({message: `Application ${existingId} not found.`}).code(404);
        }

        const existingImage = await UploadedImage.findOne(imageId);

        if (existingImage === undefined || existingImage === null) {
          return h.response({message: `Image ${imageId} not found.`}).code(404);
        }

        await UploadedImage.delete(imageId);

        return h.response().code(204);
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
