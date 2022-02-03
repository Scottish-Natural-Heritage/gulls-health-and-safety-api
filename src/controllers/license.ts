import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import config from '../config/app';
import {AdvisoryInterface} from '../models/advisory.js';
import {ConditionInterface} from '../models/condition.js';

import Application from '../controllers/application';
// import Contact from '../controllers/contact';

const {License, LicenseCondition, LicenseAdvisory, Advisory, Condition} = database;

// Disabled rules because Notify client has no index.js and implicitly has "any" type, and this is how the import is done
// in the Notify documentation - https://docs.notifications.service.gov.uk/node.html
/* eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, unicorn/prefer-module, prefer-destructuring */
const NotifyClient = require('notifications-node-client').NotifyClient;

/**
 * Local interface of the application.
 */
interface LicenseInterface {
  ApplicationId: number;
  periodFrom: string;
  periodTo: string;
}

const setLicenceNotificationDetails = (application: any, licence: any) => {
  return {
    licenceNumber: application.id,
    siteAddressLine1: application.SiteAddress.addressLine1,
    siteAddressLine2: application.SiteAddress.addressLine2
      ? application.SiteAddress.addressLine2
      : 'No address line 2 entered',
    siteAddressTown: application.SiteAddress.addressTown,
    sitePostcode: application.SiteAddress.postcode,
    dateFrom: createDisplayDate(new Date(licence.periodFrom)),
    dateTo: createDisplayDate(new Date(licence.periodTo)),
    lhName: application.LicenceHolder.name,
    addressLine1: application.LicenceHolderAddress.addressLine1,
    addressLine2: application.LicenceHolderAddress.addressLine2
      ? application.LicenceHolderAddress.addressLine2
      : 'No address line 2 entered',
    addressTown: application.LicenceHolderAddress.addressTown,
    postcode: application.LicenceHolderAddress.postcode,
    permittedSpeciesActivitiesList: createPermittedSpeciesActivitiesList(application.PermittedSpecies),
    identifiedSpecies: createIdentifiedSpecies(application.Species),
    issuesList: createIssues(application.ApplicationIssue),
    measuresTried: createMeasures(application.ApplicationMeasure, 'Tried'),
    measuresIntended: createMeasures(application.ApplicationMeasure, 'Intend'),
    measuresNotTried: createMeasures(application.ApplicationMeasure, 'No'),
    proposalResult: createProposalResult(application.Species),
    optionalAdvisoriesList: createOptionalAdvisoriesList(application.License.LicenseAdvisories),
  };
};

/**
 * This function calls the Notify API and asks for an email to be send with the supplied details.
 *
 * @param {any} emailDetails The details to use in the email to be sent.
 * @param {any} emailAddress The email address to send the email to.
 */
const sendLicenceNotificationEmail = async (emailDetails: any, emailAddress: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    notifyClient.sendEmail('82e220c4-4534-4da1-940b-353883e5dbab', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

// Create a more user friendly displayable date from a date object, format (dd/mm/yyy).
const createDisplayDate = (date: Date) => {
  return date.toLocaleDateString('en-GB', {year: 'numeric', month: 'numeric', day: 'numeric'});
};

/**
 * This function returns a slightly prettier and more accurate string of ranges.
 *
 * @param {string} range The range to made more readable.
 * @returns {string} A more accurate and readable range as a string.
 */
const displayableRanges = (range: string | undefined): string => {
  if (range === '10' || range === 'upTo10') {
    return '1 - 10';
  }

  if (range === '50' || range === 'upTo50') {
    return '11 - 50';
  }

  if (range === '100' || range === 'upTo100') {
    return '51 - 100';
  }

  if (range === '500' || range === 'upTo500') {
    return '101 - 500';
  }

  if (range === '1000' || range === 'upTo1000') {
    return '501 - 1000';
  }

  return '';
};

const createPermittedSpeciesActivitiesList = (species: any): string => {
  const permittedActivities = [];
  if (species.HerringGullId) {
    permittedActivities.push(addActivities(species.PermittedHerringGull, 'Herring gull'));
  }

  if (species.BlackHeadedGullId) {
    permittedActivities.push(addActivities(species.PermittedBlackHeadedGull, 'Black-headed gull'));
  }

  if (species.CommonGullId) {
    permittedActivities.push(addActivities(species.PermittedCommonGull, 'Common gull'));
  }

  if (species.GreatBlackBackedGullId) {
    permittedActivities.push(addActivities(species.PermittedGreatBlackBackedGull, 'Great black-backed gull'));
  }

  if (species.LesserBlackBackedGullId) {
    permittedActivities.push(addActivities(species.PermittedLesserBlackBackedGull, 'Lesser black-backed gull'));
  }

  return permittedActivities.join('\n');
};

const addActivities = (species: any, speciesType: string): string => {
  const activities: string[] = [];
  if (species.removeNests) {
    activities.push(
      `${speciesType}: To remove ${displayableRanges(
        species.quantityNestsToRemove,
      )} nests and any eggs they contain by hand.`,
    );
  }

  if (species.eggDestruction) {
    activities.push(
      `${speciesType}: To destroy eggs by oiling, pricking or replacing with dummy eggs from ${displayableRanges(
        species.quantityNestsWhereEggsDestroyed,
      )} nests.`,
    );
  }

  if (species.chicksToRescueCentre) {
    activities.push(
      `${speciesType}: To take ${String(species.quantityChicksToRescue)} chicks to a wildlife rescue centre.`,
    );
  }

  if (species.chicksRelocateNearby) {
    activities.push(`${speciesType}: To take ${String(species.quantityChicksToRelocate)} chicks and relocate nearby.`);
  }

  if (species.killChicks) {
    activities.push(`${speciesType}: To kill ${String(species.quantityChicksToKill)} chicks.`);
  }

  if (species.killAdults) {
    activities.push(`${speciesType}: To kill ${String(species.quantityAdultsToKill)} adults.`);
  }

  return activities.join('\n');
};

const createIdentifiedSpecies = (species: any): string => {
  const identifiedSpecies: string[] = [];
  if (species.HerringGullId) {
    identifiedSpecies.push('* Herring gull');
  }

  if (species.BlackHeadedGullId) {
    identifiedSpecies.push('* Black-headed gull');
  }

  if (species.CommonGullId) {
    identifiedSpecies.push('* Common gull');
  }

  if (species.GreatBlackBackedGullId) {
    identifiedSpecies.push('* Great black-backed gull');
  }

  if (species.LesserBlackBackedGullId) {
    identifiedSpecies.push('* Lesser black-backed gull');
  }

  return identifiedSpecies.join('\n');
};

const createIssues = (applicationIssues: any): string => {
  const issues: string[] = [];
  if (applicationIssues.aggression) {
    issues.push('* Aggression resulting in direct strikes');
  }

  if (applicationIssues.diveBombing) {
    issues.push('* Frequent dive-bombing');
  }

  if (applicationIssues.noise) {
    issues.push('* Noise disturbance');
  }

  if (applicationIssues.droppings) {
    issues.push('* Droppings contaminating foodstuffs');
  }

  if (applicationIssues.nestingMaterial) {
    issues.push(
      '* Build-up of nesting material in gas flues, air-conditioning units, active chimney pots or drainage systems',
    );
  }

  if (applicationIssues.atHeightAggression) {
    issues.push('* Disturbance or aggression on sites where people are working at height or with machinery');
  }

  if (applicationIssues.other) {
    issues.push('* Other issues');
  }

  return issues.join('\n');
};

const createMeasures = (applicationMeasures: any, measuresStatus: string): string => {
  const measures: string[] = [];

  if (applicationMeasures.preventNesting === measuresStatus) {
    measures.push('* Physically preventing nesting');
  }

  if (applicationMeasures.removeOldNests === measuresStatus) {
    measures.push('* Removing old nests and potential nesting material');
  }

  if (applicationMeasures.removeLitter === measuresStatus) {
    measures.push('* Removing or preventing access to attractants such as litter and food waste');
  }

  if (applicationMeasures.humanDisturbance === measuresStatus) {
    measures.push('* Human disturbance');
  }

  if (applicationMeasures.scaringDevices === measuresStatus) {
    measures.push('* Scaring devices - static or automatic');
  }

  if (applicationMeasures.hawking === measuresStatus) {
    measures.push('* Hawking by birds of prey');
  }

  if (applicationMeasures.disturbanceByDogs === measuresStatus) {
    measures.push('* Disturbance by dogs');
  }

  if (measures.length > 0) {
    return measures.join('\n');
  }

  return '* Nothing';
};

const createProposalResult = (species: any): string => {
  const proposalResult = [];
  if (species.HerringGullId) {
    proposalResult.push(addProposalResults(species.HerringGull, 'Herring gull'));
  }

  if (species.BlackHeadedGullId) {
    proposalResult.push(addProposalResults(species.BlackHeadedGull, 'Black-headed gull'));
  }

  if (species.CommonGullId) {
    proposalResult.push(addProposalResults(species.CommonGull, 'Common gull'));
  }

  if (species.GreatBlackBackedGullId) {
    proposalResult.push(addProposalResults(species.GreatBlackBackedGull, 'Great black-backed gull'));
  }

  if (species.LesserBlackBackedGullId) {
    proposalResult.push(addProposalResults(species.LesserBlackBackedGull, 'Lesser black-backed gull'));
  }

  return proposalResult.join('\n');
};

const addProposalResults = (species: any, speciesType: string): string => {
  const proposalResults: string[] = [];
  if (species.removeNests) {
    proposalResults.push(`* ${speciesType} - ${displayableRanges(species.quantityNestsToRemove)} nests removed.`);
  }

  if (species.eggDestruction) {
    proposalResults.push(
      `* ${speciesType} - ${displayableRanges(species.quantityNestsWhereEggsDestroyed)} eggs destroyed.`,
    );
  }

  if (species.chicksToRescueCentre) {
    proposalResults.push(
      `* ${speciesType} - ${String(species.quantityChicksToRescue)} chicks taken to a wildlife rescue centre.`,
    );
  }

  if (species.chicksRelocateNearby) {
    proposalResults.push(`* ${speciesType} - ${String(species.quantityChicksToRelocate)} chicks relocated nearby.`);
  }

  if (species.killChicks) {
    proposalResults.push(`* ${speciesType} - ${String(species.quantityChicksToKill)} chicks killed.`);
  }

  if (species.killAdults) {
    proposalResults.push(`* ${speciesType} - ${String(species.quantityAdultsToKill)} adults killed.`);
  }

  return proposalResults.join('\n');
};

const createOptionalAdvisoriesList = (advisories: any): string => {
  const optionalAdvisoryIds = [1, 2, 7];
  // const optionalWhatMustBeDoneConditionIds = [4, 6, 7];
  // const optionalGeneralConditionIds = [12, 13];
  const advisoryList = [];

  const optionalAdvisories = advisories.filter((optional: any) => optionalAdvisoryIds.includes(optional.Advisory.id));
  for (const advisory of optionalAdvisories){
    advisoryList.push(advisory.Advisory.advisory)
  }

  return advisoryList.join('\n\n');
};

const LicenseController = {
  findOne: async (id: number) => {
    return License.findByPk(id, {
      include: [
        {
          model: LicenseCondition,
          as: 'LicenseConditions',
        },
        {
          model: LicenseAdvisory,
          as: 'LicenseAdvisories',
        },
      ],
    });
  },

  findAll: async () => {
    return License.findAll();
  },

  /**
   * The create function writes the incoming license to the appropriate database tables.
   *
   * @param {any } applicationId The application that the license will be based on.
   * @param {Condition | undefined} optionalConditions The optional Conditions submitted by the LO.
   * @param {any | undefined} optionalAdvisories The optional Advisory notes submitted by the LO.
   * @param {any | undefined} incomingLicense The License details.
   * @returns {any} Returns newLicense, the newly created License.
   */
  create: async (
    applicationId: any,
    optionalConditions: ConditionInterface[] | undefined,
    optionalAdvisories: AdvisoryInterface[] | undefined,
    incomingLicense: any,
  ) => {
    let newLicense;
    // Start a transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      incomingLicense.ApplicationId = applicationId;

      // Add the License to the DB.
      newLicense = await License.create(incomingLicense, {transaction: t});

      // Fetch all the default conditions.
      const conditions = await Condition.findAll({where: {default: true}});
      const advisories = await Advisory.findAll({where: {default: true}});
      // Add any conditions to the DB.
      await Promise.all(
        conditions.map(async (jsonCondition) => {
          await LicenseCondition.create(
            {
              LicenseId: applicationId,
              ConditionId: jsonCondition.id,
            },
            {transaction: t},
          );
        }),
      );
      if (optionalConditions) {
        await Promise.all(
          optionalConditions.map(async (optionalJsonCondition) => {
            await LicenseCondition.create(
              {
                LicenseId: applicationId,
                ConditionId: optionalJsonCondition.id,
              },
              {transaction: t},
            );
          }),
        );
      }

      // Add any advisories to the DB.
      await Promise.all(
        advisories.map(async (jsonAdvisory) => {
          await LicenseAdvisory.create(
            {
              LicenseId: applicationId,
              AdvisoryId: jsonAdvisory.id,
            },
            {transaction: t},
          );
        }),
      );

      if (optionalAdvisories) {
        await Promise.all(
          optionalAdvisories.map(async (optionalJsonAdvisory) => {
            await LicenseAdvisory.create(
              {
                LicenseId: applicationId,
                AdvisoryId: optionalJsonAdvisory.id,
              },
              {transaction: t},
            );
          }),
        );
      }
    });

    if (newLicense) {
      const applicationDetails: any = await Application.findOne(applicationId);

      const emailDetails = setLicenceNotificationDetails(applicationDetails, incomingLicense);

      try {
        await sendLicenceNotificationEmail(emailDetails, applicationDetails.LicenceHolder?.emailAddress);
      } catch (error: unknown) {
        return error;
      }
    }

    // If all went well and we have a new application return it.
    if (newLicense) {
      return newLicense as LicenseInterface;
    }

    // If no new application was added to the DB return undefined.
    return undefined;
  },
};

export {LicenseController as default};
export {LicenseInterface};
