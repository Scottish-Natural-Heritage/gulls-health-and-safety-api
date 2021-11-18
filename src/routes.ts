import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';
import PostcodeLookupController from './controllers/postcode-lookup-controller';
import PostcodeLookup from './models/postcode-lookup';
import utils from 'naturescot-utils';
// import Contact from './controllers/contact';
// import Address from './controllers/address';
// import Issue from './controllers/issue';
// import Activity from './controllers/activity';
import Species from './controllers/species';
// import Measure from './controllers/measure';
import Application from './controllers/application';

const cleanOnBehalfContact = (body: any) => {
  return {
    name: body.onBehalfDetails.name.trim(),
    organisation:
      body.onBehalfDetails.organisation === undefined ? undefined : body.onBehalfDetails.organisation.trim(),
    emailAddress: utils.formatters.stripAndRemoveObscureWhitespace(body.onBehalfDetails.emailAddress.toLowerCase()),
    phoneNumber: body.onBehalfDetails.phoneNumber === undefined ? undefined : body.onBehalfDetails.phoneNumber.trim(),
  };
};

const cleanLicenseHolderContact = (body: any) => {
  return {
    name: body.licenceHolderDetails.name.trim(),
    organisation:
      body.licenceHolderDetails.organisation === undefined ? undefined : body.licenceHolderDetails.organisation.trim(),
    emailAddress: utils.formatters.stripAndRemoveObscureWhitespace(
      body.licenceHolderDetails.emailAddress.toLowerCase(),
    ),
    phoneNumber:
      body.licenceHolderDetails.phoneNumber === undefined ? undefined : body.licenceHolderDetails.phoneNumber.trim(),
  };
};

const cleanAddress = (body: any) => {
  return {
    uprn: body.uprn === undefined ? undefined : body.uprn.trim(),
    postcode: body.postcode.trim(),
    addressLine1: body.manualAddress?.addressLine1.trim(),
    addressLine2: body.manualAddress?.addressLine2 === undefined ? undefined : body.manualAddress?.addressLine2.trim(),
    addressTown: body.manualAddress?.addressTown.trim(),
    addressCounty: body.manualAddress?.addressCounty.trim(),
  };
};

const cleanSiteAddress = (body: any) => {
  return {
    uprn: body.siteUprn === undefined ? undefined : body.uprn.trim(),
    postcode: body.sitePostcode.trim(),
    addressLine1: body.siteManualAddress?.addressLine1.trim(),
    addressLine2:
      body.siteManualAddress?.addressLine2 === undefined ? undefined : body.siteManualAddress?.addressLine2.trim(),
    addressTown: body.siteManualAddress?.addressTown.trim(),
    addressCounty: body.siteManualAddress?.addressCounty.trim(),
  };
};

const cleanApplication = (body: any) => {
  return {
    isResidentialSite: body.isResidentialSite,
    siteType: body.isResidentialSite ? body.residentialType : body.commercialType,
    previousLicenceNumber: body.previousLicence ? body.previousLicenceNumber.trim() : undefined,
    supportingInformation: body.supportingInformation === undefined ? undefined : body.supportingInformation.trim(),
  };
};

const cleanIssue = (body: any) => {
  return {
    // Just copy across the booleans.
    aggression: body.issueOnSite.aggression,
    diveBombing: body.issueOnSite.diveBombing,
    noise: body.issueOnSite.noise,
    droppings: body.issueOnSite.droppings,
    nestingMaterial: body.issueOnSite.nestingMaterial,
    atHeightAggression: body.issueOnSite.atHeightAggression,
    other: body.issueOnSite.other,
    // And clean the remaining strings a little.
    whenIssue: body.siteIssueDetails.whenIssue.trim(),
    whoAffected: body.siteIssueDetails.whoAffected.trim(),
    howAffected: body.siteIssueDetails.howAffected.trim(),
    otherIssueInformation:
      body.siteIssueDetails.otherIssueInformation === undefined
        ? undefined
        : body.siteIssueDetails.otherIssueInformation.trim(),
  };
};

const cleanActivity = (body: any, gullType: string) => {
  return {
    removeNests: body.species?.[gullType].activities.removeNests,
    quantityNestsToRemove: body.species?.[gullType].activities.quantityNestsToRemove
      ? body.species?.[gullType].activities.quantityNestsToRemove
      : undefined,
    eggDestruction: body.species?.[gullType].activities.eggDestruction,
    quantityNestsWhereEggsDestroyed: body.species?.[gullType].activities.quantityNestsWhereEggsDestroyed
      ? body.species?.[gullType].activities.quantityNestsWhereEggsDestroyed
      : undefined,
    chicksToRescueCentre: body.species?.[gullType].activities.chicksToRescueCentre,
    quantityChicksToRescue: body.species?.[gullType].activities.quantityChicksToRescue
      ? body.species?.[gullType].activities.quantityChicksToRescue
      : undefined,
    chicksRelocateNearby: body.species?.[gullType].activities.chicksRelocateNearby,
    quantityChicksToRelocate: body.species?.[gullType].activities.quantityChicksToRelocate
      ? body.species?.[gullType].activities.quantityChicksToRelocate
      : undefined,
    killChicks: body.species?.[gullType].activities.killChicks,
    quantityChicksToKill: body.species?.[gullType].activities.quantityChicksToKill
      ? body.species?.[gullType].activities.quantityChicksToKill
      : undefined,
    killAdults: body.species?.[gullType].activities.killAdults,
    quantityAdultsToKill: body.species?.[gullType].activities.quantityAdultsToKill
      ? body.species?.[gullType].activities.quantityAdultsToKill
      : undefined,
  };
};

const cleanMeasure = (body: any) => {
  return {
    preventNesting: body.measuresTried.preventNesting
      ? 'Tried'
      : body.measuresIntendToTry.preventNesting
      ? 'Intend'
      : 'no',
    removeOldNests: body.measuresTried.removeOldNests
      ? 'Tried'
      : body.measuresIntendToTry.removeOldNests
      ? 'Intend'
      : 'no',
    removeLitter: body.measuresTried.removeLitter ? 'Tried' : body.measuresIntendToTry.removeLitter ? 'Intend' : 'no',
    humanDisturbance: body.measuresTried.humanDisturbance
      ? 'Tried'
      : body.measuresIntendToTry.humanDisturbance
      ? 'Intend'
      : 'no',
    scaringDevices: body.measuresTried.scaringDevices
      ? 'Tried'
      : body.measuresIntendToTry.scaringDevices
      ? 'Intend'
      : 'no',
    hawking: body.measuresTried.hawking ? 'Tried' : body.measuresIntendToTry.hawking ? 'Intend' : 'no',
    disturbanceByDogs: body.measuresTried.disturbanceByDogs
      ? 'Tried'
      : body.measuresIntendToTry.disturbanceByDogs
      ? 'Intend'
      : 'no',
    measuresTriedDetail: body.measuresTriedMoreDetail.trim(),
    measuresWillNotTryDetail: body.measuresIntendNotToTry.trim(),
  };
};

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
    method: 'post',
    path: `/application`,
    handler: async (request: Request, h: ResponseToolkit) => {
      try {
        const application = request.payload as any;

        let onBehalfContact;
        let siteAddress;
        let herringActivity;
        let blackHeadedActivity;
        let commonActivity;
        let greatBlackBackedActivity;
        let lesserBlackBackedActivity;

        // Clean the incoming data.
        const licenceHolderContact = cleanLicenseHolderContact(application);
        const address = cleanAddress(application);
        const issue = cleanIssue(application);
        const measure = cleanMeasure(application);

        // Clean the optional incoming data.
        if (application.onBehalf) {
          onBehalfContact = cleanOnBehalfContact(application);
        }

        // Clean all the possible species activities.
        if (!application.sameAddressAsLicenceHolder) {
          siteAddress = cleanSiteAddress(application);
        }

        if (application.species.herringGull.requiresLicense) {
          herringActivity = cleanActivity(application, 'herringGull');
        }

        if (application.species.blackHeadedGull.requiresLicense) {
          blackHeadedActivity = cleanActivity(application, 'blackHeadedGull');
        }

        if (application.species.commonGull.requiresLicense) {
          commonActivity = cleanActivity(application, 'commonGull');
        }

        if (application.species.greatBlackBackedGull.requiresLicense) {
          greatBlackBackedActivity = cleanActivity(application, 'greatBlackBackedGull');
        }

        if (application.species.lesserBlackBackedGull.requiresLicense) {
          lesserBlackBackedActivity = cleanActivity(application, 'lesserBlackBackedGull');
        }

        // Clean the fields on the application.
        const incomingApplication = cleanApplication(application);

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
          measure,
          incomingApplication,
        );

        return newApplication;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
  },
  {
    method: 'get',
    path: `/test-getting`,
    handler: async (_request: Request, h: ResponseToolkit) => {
      const species = await Species.findAll();
      return species;
    },
  },
];

export default routes;
