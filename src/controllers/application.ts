import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
// import NotifyClient from 'notifications-node-client';
const NotifyClient = require('notifications-node-client').NotifyClient;

const {Application, Contact, Address, Activity, Issue, Measure, Species} = database;

/**
 * Local interface to hold the species ID foreign keys.
 */
interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

/**
 * Local interface of the application.
 */
interface application {
  id: number;
  LicenceHolderId: number;
  LicenceApplicantId: number;
  LicenceHolderAddressId: number;
  SiteAddressId: number;
  SpeciesId: number;
  isResidentialSite: boolean;
  siteType: string;
  previousLicenceNumber: string;
  supportingInformation: string;
}

const setLicenceHolderDirectEmailDetails = {};

const sendLicenceHolderDirectEmail = async () => {
  const notifyClient = new NotifyClient()
}

const ApplicationController = {
  findOne: async (id: number) => {
    return Application.findByPk(id, {
      include: [
        {
          model: Contact,
          as: 'LicenceHolder',
        },
        {
          model: Contact,
          as: 'LicenceApplicant',
        },
        {
          model: Address,
          as: 'LicenceHolderAddress',
        },
        {
          model: Address,
          as: 'SiteAddress',
        },
        {
          model: Species,
          as: 'Species',
          include: [
            {
              model: Activity,
              as: 'HerringGull',
            },
            {
              model: Activity,
              as: 'BlackHeadedGull',
            },
            {
              model: Activity,
              as: 'CommonGull',
            },
            {
              model: Activity,
              as: 'GreatBlackBackedGull',
            },
            {
              model: Activity,
              as: 'LesserBlackBackedGull',
            },
          ],
        },
        {
          model: Issue,
          as: 'ApplicationIssue',
        },
        {
          model: Measure,
          as: 'ApplicationMeasure',
        },
      ],
    });
  },

  findAll: async () => {
    return Application.findAll();
  },

  /**
   * The create function writes the incoming application to the appropriate database tables.
   *
   * @param {any | undefined} onBehalfContact The on behalf contact details.
   * @param {any | undefined} licenceHolderContact The license holder contact details.
   * @param {any | undefined} address The license holder's address.
   * @param {any | undefined} siteAddress The site's address.
   * @param {any | undefined} issue The issue details.
   * @param {any | undefined} herringActivity The herring gull activities to be licensed.
   * @param {any | undefined} blackHeadedActivity The black-headed gull activities to be licensed.
   * @param {any | undefined} commonActivity The common gull activities to be licensed.
   * @param {any | undefined} greatBlackBackedActivity The great black-backed gull activities to be licensed.
   * @param {any | undefined} lesserBlackBackedActivity The lesser black-backed gull activities to be licensed.
   * @param {any | undefined} measure The measures taken / not taken details.
   * @param {any | undefined} incomingApplication The application details.
   * @returns {application} Returns newApplication, the newly created application.
   */
  create: async (
    onBehalfContact: any | undefined,
    licenceHolderContact: any,
    address: any,
    siteAddress: any | undefined,
    issue: any,
    herringActivity: any | undefined,
    blackHeadedActivity: any | undefined,
    commonActivity: any | undefined,
    greatBlackBackedActivity: any | undefined,
    lesserBlackBackedActivity: any | undefined,
    measure: any,
    incomingApplication: any,
  ) => {
    const speciesIds: SpeciesIds = {
      HerringGullId: undefined,
      BlackHeadedGullId: undefined,
      CommonGullId: undefined,
      GreatBlackBackedGullId: undefined,
      LesserBlackBackedGullId: undefined,
    };
    let newApplication;
    // Start a transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      let newOnBehalfContact;
      let newSiteAddress;
      // Add the licence holder details to DB, and optional on-behalf contact details.
      const newLicenceHolderContact = await Contact.create(licenceHolderContact, {transaction: t});
      if (onBehalfContact) {
        newOnBehalfContact = await Contact.create(onBehalfContact, {transaction: t});
      }

      // Add licence holder address to DB and Site address. Check if the addresses are the same.
      const newAddress = await Address.create(address, {transaction: t});
      if (siteAddress) {
        newSiteAddress = await Address.create(siteAddress, {transaction: t});
      } else {
        siteAddress = address;
      }

      // Add any species specific activities to the DB and get their IDs.
      if (herringActivity) {
        const herringGull = await Activity.create(herringActivity, {transaction: t});
        speciesIds.HerringGullId = herringGull.id;
      }

      if (blackHeadedActivity) {
        const blackHeadedGull = await Activity.create(blackHeadedActivity, {transaction: t});
        speciesIds.BlackHeadedGullId = blackHeadedGull.id;
      }

      if (commonActivity) {
        const commonGull = await Activity.create(commonActivity, {transaction: t});
        speciesIds.CommonGullId = commonGull.id;
      }

      if (greatBlackBackedActivity) {
        const greatBlackBackedGull = await Activity.create(greatBlackBackedActivity, {transaction: t});
        speciesIds.GreatBlackBackedGullId = greatBlackBackedGull.id;
      }

      if (lesserBlackBackedActivity) {
        const lesserBlackBackedGull = await Activity.create(lesserBlackBackedActivity, {transaction: t});
        speciesIds.LesserBlackBackedGullId = lesserBlackBackedGull.id;
      }

      // Set the species foreign keys in the DB.
      const newSpecies = await Species.create(speciesIds, {transaction: t});

      // Set the application's foreign keys.
      incomingApplication.LicenceHolderId = newLicenceHolderContact.id;
      incomingApplication.LicenceApplicantId = newOnBehalfContact ? newOnBehalfContact.id : newLicenceHolderContact.id;
      incomingApplication.LicenceHolderAddressId = newAddress.id;
      incomingApplication.SiteAddressId = newSiteAddress ? newSiteAddress.id : newAddress.id;
      incomingApplication.SpeciesId = newSpecies.id;

      let newId; // The prospective random ID of the new application.
      let existingApplication; // Possible already assigned application.
      let remainingAttempts = 10; // Allow 10 attempts to check if the ID is in use.
      let foundExistingId = true; // Assume true until checked.

      // Generate a random 6 digit ID and check if it's already in use.
      // No await in loop disabled because we need to wait for the result.
      /* eslint-disable no-await-in-loop */
      while (foundExistingId && remainingAttempts > 0) {
        newId = Math.floor(Math.random() * 999_999);
        existingApplication = await Application.findByPk(newId);
        if (!existingApplication) {
          foundExistingId = false;
        }

        remainingAttempts--;
      }
      /* eslint-enable no-await-in-loop */

      incomingApplication.id = newId;

      // Add the application to the DB.
      newApplication = await Application.create(incomingApplication, {transaction: t});

      // Add any measures taken / tried / etc to the DB.
      measure.ApplicationId = newApplication.id;
      await Measure.create(measure, {transaction: t});

      // Add any issues declared to the DB.
      issue.ApplicationId = newApplication.id;
      await Issue.create(issue, {transaction: t});
    });

    // If all went well and we have a new application return it.
    if (newApplication) {
      return newApplication as application;
    }

    // If no new application was added to the DB return undefined.
    return undefined;
  },
};

export {ApplicationController as default};
