import utils from 'naturescot-utils';
import {AssessmentInterface} from 'models/assessment';

/**
 * Cleans the on behalf contact details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @returns {any} The cleaned on behalf contact details.
 */
const cleanOnBehalfContact = (body: any): any => {
  return {
    name: body.onBehalfDetails.name.trim(),
    organisation:
      body.onBehalfDetails.organisation === undefined ? undefined : body.onBehalfDetails.organisation.trim(),
    emailAddress: utils.formatters.stripAndRemoveObscureWhitespace(body.onBehalfDetails.emailAddress.toLowerCase()),
    phoneNumber: body.onBehalfDetails.phoneNumber === undefined ? undefined : body.onBehalfDetails.phoneNumber.trim(),
  };
};

/**
 * Cleans the license holder contact details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @returns {any} The cleaned license holder contact details.
 */
const cleanLicenseHolderContact = (body: any): any => {
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

/**
 * Cleans the license holder address details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @returns {any} The cleaned license holder address details.
 */
const cleanAddress = (body: any): any => {
  return {
    uprn: body.uprn === undefined ? undefined : (body.uprn as string),
    postcode: body.postcode.trim(),
    addressLine1: body.manualAddress?.addressLine1 === undefined ? undefined : body.manualAddress?.addressLine1.trim(),
    addressLine2: body.manualAddress?.addressLine2 === undefined ? undefined : body.manualAddress?.addressLine2.trim(),
    addressTown: body.manualAddress?.addressTown === undefined ? undefined : body.manualAddress?.addressTown.trim(),
    addressCounty:
      body.manualAddress?.addressCounty === undefined ? undefined : body.manualAddress?.addressCounty.trim(),
  };
};

/**
 * Cleans the site address details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @returns {any} The cleaned site address details.
 */
const cleanSiteAddress = (body: any): any => {
  return {
    uprn: body.siteUprn === undefined ? undefined : (body.siteUprn as string),
    postcode: body.sitePostcode.trim(),
    addressLine1:
      body.siteManualAddress?.addressLine1 === undefined ? undefined : body.siteManualAddress?.addressLine1.trim(),
    addressLine2:
      body.siteManualAddress?.addressLine2 === undefined ? undefined : body.siteManualAddress?.addressLine2.trim(),
    addressTown:
      body.siteManualAddress?.addressTown === undefined ? undefined : body.siteManualAddress?.addressTown.trim(),
    addressCounty:
      body.siteManualAddress?.addressCounty === undefined ? undefined : body.siteManualAddress?.addressCounty.trim(),
  };
};

/**
 * Cleans the application details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @returns {any} The cleaned application details.
 */
const cleanApplication = (body: any): any => {
  return {
    isResidentialSite: body.isResidentialSite,
    siteType: body.isResidentialSite ? body.residentialType : body.commercialType,
    previousLicence: body.previousLicense,
    previousLicenceNumber: body.previousLicenseNumber ? body.previousLicenseNumber.trim() : undefined,
    supportingInformation: body.supportingInformation === undefined ? undefined : body.supportingInformation.trim(),
    confirmedByLicensingHolder: !body.onBehalf,
  };
};

/**
 * Cleans the issue details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @returns {any} The cleaned issue details.
 */
const cleanIssue = (body: any): any => {
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

/**
 * Cleans the activity details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @param {string} gullType The type of gull the activities relate to.
 * @returns {any} The cleaned activity details.
 */
const cleanActivity = (body: any, gullType: string): any => {
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

// Disabled because of conflict between editorconfig and prettier.
/* eslint-disable editorconfig/indent */
/**
 * Cleans the measure details into something the database can use.
 *
 * @param {any} body The body of the request to be cleaned.
 * @returns {any} The cleaned measure details.
 */
const cleanMeasure = (body: any): any => {
  return {
    preventNesting: body.measuresTried.preventNesting
      ? 'Tried'
      : body.measuresIntendToTry.preventNesting
      ? 'Intend'
      : 'No',
    removeOldNests: body.measuresTried.removeOldNests
      ? 'Tried'
      : body.measuresIntendToTry.removeOldNests
      ? 'Intend'
      : 'No',
    removeLitter: body.measuresTried.removeLitter ? 'Tried' : body.measuresIntendToTry.removeLitter ? 'Intend' : 'No',
    humanDisturbance: body.measuresTried.humanDisturbance
      ? 'Tried'
      : body.measuresIntendToTry.humanDisturbance
      ? 'Intend'
      : 'No',
    scaringDevices: body.measuresTried.scaringDevices
      ? 'Tried'
      : body.measuresIntendToTry.scaringDevices
      ? 'Intend'
      : 'No',
    hawking: body.measuresTried.hawking ? 'Tried' : body.measuresIntendToTry.hawking ? 'Intend' : 'No',
    disturbanceByDogs: body.measuresTried.disturbanceByDogs
      ? 'Tried'
      : body.measuresIntendToTry.disturbanceByDogs
      ? 'Intend'
      : 'No',
    measuresTriedDetail: body.measuresTriedMoreDetail ? body.measuresTriedMoreDetail.trim() : undefined,
    measuresWillNotTryDetail: body.measuresIntendNotToTry ? body.measuresIntendNotToTry.trim() : undefined,
  };
};

/**
 * This function returns an address object for a supplied UPRN.
 *
 * @param {number} uprn The UPRN to resolve to an address.
 * @returns {any} The address details for the passed UPRN.
 */

/**
 * Clean an incoming PATCH request body to make it more compatible with the
 * database and its validation rules.
 *
 * @param {any} body The incoming request's body.
 * @returns {any} CleanedBody a json object that's just got our cleaned up fields on it.
 */
const cleanAssessment = (body: any): any => {
  const cleanedBody: AssessmentInterface = {};

  // Check for the existence of each field and if found clean it if required and add to the cleanedBody object.
  if (body.testOneAssessment) {
    cleanedBody.testOneAssessment = body.testOneAssessment.trim();
  }

  if ('testOneDecision' in body) {
    cleanedBody.testOneDecision = body.testOneDecision;
  }

  if (body.testTwoAssessment) {
    cleanedBody.testTwoAssessment = body.testTwoAssessment.trim();
  }

  if ('testTwoDecision' in body) {
    cleanedBody.testTwoDecision = body.testTwoDecision;
  }

  if ('decision' in body) {
    cleanedBody.decision = body.decision;
  }

  return cleanedBody;
};

/* eslint-enable editorconfig/indent */

const CleaningFunctions = {
  cleanOnBehalfContact,
  cleanLicenseHolderContact,
  cleanAddress,
  cleanSiteAddress,
  cleanApplication,
  cleanIssue,
  cleanActivity,
  cleanMeasure,
  cleanAssessment,
};

export default CleaningFunctions;
