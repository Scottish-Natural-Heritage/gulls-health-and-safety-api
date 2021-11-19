import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Application, Contact, Address, Activity, Issue, Measure, Species} = database;

interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

const ApplicationController = {
  findOne: async (id: number) => {
    return Application.findByPk(id);
  },

  findAll: async () => {
    return Application.findAll();
  },

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
    let speciesIds: SpeciesIds = {
      HerringGullId: undefined,
      BlackHeadedGullId: undefined,
      CommonGullId: undefined,
      GreatBlackBackedGullId: undefined,
      LesserBlackBackedGullId: undefined,
    };
    let newApplication;
    await database.sequelize.transaction(async (t: transaction) => {
      let newOnBehalfContact;
      let newSiteAddress;
      const newLicenceHolderContact = await Contact.create(licenceHolderContact, {transaction: t});
      if (onBehalfContact) {
        newOnBehalfContact = await Contact.create(onBehalfContact, {transaction: t});
      }
      const newAddress = await Address.create(address, {transaction: t});
      if (siteAddress) {
        newSiteAddress = await Address.create(siteAddress, {transaction: t});
      } else {
        siteAddress = newAddress;
      }

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

      const newSpecies = await Species.create(speciesIds, {transaction: t});

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
      while (foundExistingId && remainingAttempts > 0) {
        newId = Math.floor(Math.random() * 999999);
        existingApplication = await Application.findByPk(newId);
        if (!existingApplication) {
          foundExistingId = false;
        }
        remainingAttempts--;
      }

      incomingApplication.id = newId;

      newApplication = await Application.create(incomingApplication, {transaction: t});

      measure.ApplicationId = newApplication.id;
      await Measure.create(measure, {transaction: t});

      issue.ApplicationId = newApplication.id;
      await Issue.create(issue, {transaction: t});
    });
    return newApplication;
  },
};

export {ApplicationController as default};
