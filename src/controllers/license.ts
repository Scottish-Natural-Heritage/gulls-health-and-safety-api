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
    siteAddressLine2: application.SiteAddress.addressLine2 ? application.SiteAddress.addressLine2 : 'No address line 2 entered',
    siteAddressTown: application.SiteAddress.addressTown,
    sitePostcode: application.SiteAddress.postcode,
    dateFrom: createDisplayDate(new Date(licence.periodFrom)),
    dateTo: createDisplayDate(new Date(licence.periodTo)),
    lhName: application.LicenceHolder.name,
    addressLine1: application.LicenceHolderAddress.addressLine1,
    addressLine2: application.LicenceHolderAddress.addressLine2 ? application.LicenceHolderAddress.addressLine2 : 'No address line 2 entered',
    addressTown: application.LicenceHolderAddress.addressTown,
    postcode: application.LicenceHolderAddress.postcode,
    permittedSpeciesActivitiesList: createPermittedSpeciesActivitiesList(application.PermittedSpecies)
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
  let displayableRange = '';
  switch (range) {
    case 'upTo10':
      displayableRange = '1 - 10';
      break;
    case 'upTo50':
      displayableRange = '11 - 50';
      break;
    case 'upTo100':
      displayableRange = '51 - 100';
      break;
    case 'upTo500':
      displayableRange = '101 - 500';
      break;
    case 'upTo1000':
      displayableRange = '501 - 1000';
      break;
    default:
      displayableRange = '';
      break;
  }

  return displayableRange;
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
}

const addActivities = (species: any, speciesType: string): string => {
  const activities: string[] = [];
  if (species.removeNests) {
    activities.push(
      `${speciesType}: To remove ${displayableRanges(
        species.quantityNestsToRemove
      )} nests and any eggs they contain by hand.`
    );
  }

  if (species.eggDestruction) {
    activities.push(
      `${speciesType}: To destroy eggs by oiling, pricking or replacing with dummy eggs from ${displayableRanges(
        species.quantityNestsWhereEggsDestroyed
      )} nests.`
    );
  }

  if (species.chicksToRescueCentre) {
    activities.push(
      `${speciesType}: To take ${String(species.quantityChicksToRescue)} chicks to a wildlife rescue centre.`
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
