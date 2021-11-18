import {ServerRoute, Request, ResponseToolkit} from '@hapi/hapi';
import PostcodeLookupController from './controllers/postcode-lookup-controller';
import PostcodeLookup from './models/postcode-lookup';
import utils from 'naturescot-utils';
import Contact from './controllers/contact';
import Address from './controllers/address';
import Issue from './controllers/issue';
import Activity from './controllers/activity';
import Species from './controllers/species';
import Measure from './controllers/measure';

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

// const cleanApplication = (body: any) => {
//   return {
//     isResidentialSite: body.isResidentialSite,
//     siteType: body.isResidentialSite ? body.residentialType : body.commercialType,
//     previousLicenceNumber: body.previousLicence ? body.previousLicenceNumber.trim() : undefined,
//     supportingInformation: body.supportingInformation === undefined ? undefined : body.supportingInformation.trim(),
//   };
// };

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
      const application = request.payload as any;
      let newOnBehalfContact;
      let newSiteAddress;
      try {
        if (application.onBehalf) {
          const onBehalfContact = cleanOnBehalfContact(application);
          newOnBehalfContact = await Contact.create(onBehalfContact);
        }
        const licenceHolderContact = cleanLicenseHolderContact(application);
        const newLicenceHolderContact = await Contact.create(licenceHolderContact);

        const address = cleanAddress(application);
        const newAddress = await Address.create(address);
        if (!application.sameAddressAsLicenceHolder) {
          const siteAddress = cleanSiteAddress(application);
          newSiteAddress = await Address.create(siteAddress);
        } else {
          newSiteAddress = newAddress;
        }

        const issue = cleanIssue(application);
        const newIssue = await Issue.create(issue);

        interface SpeciesIds {
          HerringGullId: number | undefined;
          BlackHeadedGullId: number | undefined;
          CommonGullId: number | undefined;
          GreatBlackBackedGullId: number | undefined;
          LesserBlackBackedGullId: number | undefined;
        }

        let speciesIds: SpeciesIds = {
          HerringGullId: undefined,
          BlackHeadedGullId: undefined,
          CommonGullId: undefined,
          GreatBlackBackedGullId: undefined,
          LesserBlackBackedGullId: undefined,
        };

        if (application.species.herringGull.requiresLicense) {
          const herringActivity = cleanActivity(application, 'herringGull');
          const herringGull = await Activity.create(herringActivity);
          speciesIds.HerringGullId = herringGull.id;
        }

        if (application.species.blackHeadedGull.requiresLicense) {
          const blackHeadedActivity = cleanActivity(application, 'blackHeadedGull');
          const blackHeadedGull = await Activity.create(blackHeadedActivity);
          speciesIds.BlackHeadedGullId = blackHeadedGull.id;
        }

        if (application.species.commonGull.requiresLicense) {
          const commonActivity = cleanActivity(application, 'commonGull');
          const commonGull = await Activity.create(commonActivity);
          speciesIds.CommonGullId = commonGull.id;
        }

        if (application.species.greatBlackBackedGull.requiresLicense) {
          const greatBlackBackedActivity = cleanActivity(application, 'greatBlackBackedGull');
          const greatBlackBackedGull = await Activity.create(greatBlackBackedActivity);
          speciesIds.GreatBlackBackedGullId = greatBlackBackedGull.id;
        }

        if (application.species.lesserBlackBackedGull.requiresLicense) {
          const lesserBlackBackedActivity = cleanActivity(application, 'lesserBlackBackedGull');
          const lesserBlackBackedGull = await Activity.create(lesserBlackBackedActivity);
          speciesIds.LesserBlackBackedGullId = lesserBlackBackedGull.id;
        }

        const newSpecies = await Species.create(speciesIds);

        const measure = cleanMeasure(application);
        const newMeasure = await Measure.create(measure);

        console.log(newOnBehalfContact);
        console.log(newLicenceHolderContact);
        console.log(newAddress);
        console.log(newSiteAddress);
        console.log(newIssue);
        console.log(speciesIds);
        console.log(newSpecies);
        console.log(newMeasure);

        return newMeasure;
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
