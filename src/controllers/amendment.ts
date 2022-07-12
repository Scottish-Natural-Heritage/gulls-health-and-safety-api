import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import {AdvisoryInterface} from '../models/advisory.js';
import {ConditionInterface} from '../models/condition.js';
import config from '../config/app';
import MultiUseFunctions from '../multi-use-functions';
import AdvisoryController from './advisory';
import ConditionController from './condition';
import ApplicationController from './application';

const {Amendment, ASpecies, AActivity, AmendCondition, AmendAdvisory, Note, Advisory, Condition} = database;

// Disabled rules because Notify client has no index.js and implicitly has "any" type, and this is how the import is done
// in the Notify documentation - https://docs.notifications.service.gov.uk/node.html
/* eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, unicorn/prefer-module, prefer-destructuring */
const NotifyClient = require('notifications-node-client').NotifyClient;

interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

interface AmendmentInterface {
  id: number | undefined;
  amendReason: string | undefined;
  amendedBy: string | undefined;
  assessment: string | undefined;
}

/**
 * This function creates a formatted string of species and the activities permitted
 * in the licence to be issued.
 *
 * @param {any} species The species the activities pertain to.
 * @returns {string} Returns a string with all species and licenced activities.
 */
const createPermittedActivitiesList = (species: any): string => {
  const permittedActivities = [];
  permittedActivities.push(
    'Numbers permitted for amended activities are the total for the site, not additional to those already permitted.\n',
  );

  if (species.HerringGullId) {
    permittedActivities.push(addActivities(species.AHerringGull, 'Herring gull'));
  }

  if (species.BlackHeadedGullId) {
    permittedActivities.push(addActivities(species.ABlackHGull, 'Black-headed gull'));
  }

  if (species.CommonGullId) {
    permittedActivities.push(addActivities(species.ACommonGull, 'Common gull'));
  }

  if (species.GreatBlackBackedGullId) {
    permittedActivities.push(addActivities(species.AGreatBBGull, 'Great black-backed gull'));
  }

  if (species.LesserBlackBackedGullId) {
    permittedActivities.push(addActivities(species.ALesserBBGull, 'Lesser black-backed gull'));
  }

  return permittedActivities.join('\n');
};

/**
 * This function adds the activities to a supplied species string.
 *
 * @param {any} species The species for which the activities to be licenced pertains.
 * @param {string} speciesType A string representing the species name.
 * @returns {string} Returns a formatted string of all activities for the given species.
 */
const addActivities = (species: any, speciesType: string): string => {
  const activities: string[] = [];
  if (species.removeNests) {
    activities.push(
      `${speciesType}: To take and destroy up to ${String(
        species.quantityNestsToRemove,
      )} nests and any eggs they contain by hand.`,
    );
  }

  if (species.eggDestruction) {
    activities.push(
      `${speciesType}: To take and destroy eggs from up to ${String(
        species.quantityNestsWhereEggsDestroyed,
      )} nests by oiling, pricking or replacing with dummy eggs.`,
    );
  }

  if (species.chicksToRescueCentre) {
    activities.push(
      `${speciesType}: To take ${String(
        species.quantityChicksToRescue,
      )} chicks to a wildlife rescue centre by hand, net or trap.`,
    );
  }

  if (species.chicksRelocateNearby) {
    activities.push(
      `${speciesType}: To take ${String(
        species.quantityChicksToRelocate,
      )} chicks and relocate nearby by hand, net or trap.`,
    );
  }

  if (species.killChicks) {
    activities.push(
      `${speciesType}: To kill up to ${String(
        species.quantityChicksToKill,
      )} chicks by shooting or by hand, net or trap.`,
    );
  }

  if (species.killAdults) {
    activities.push(
      `${speciesType}: To kill up to ${String(
        species.quantityAdultsToKill,
      )} adults by shooting, falconry or by hand, net or trap.`,
    );
  }

  return activities.join('\n');
};

/**
 * This function returns a list of optional advisory notes.
 *
 * @param {any} advisories The list of advisories associated with the licence.
 * @returns {string} Returns a formatted list of optional advisories.
 */
const createAdvisoriesList = async (advisories: any): Promise<string> => {
  // Get all optional advisories from the database.
  const allOptionalAdvisories = await AdvisoryController.findAllOptional();

  const optionalAdvisoryIds = new Set();

  // Add the advisory IDs to a set.
  for (const advisory of allOptionalAdvisories) {
    optionalAdvisoryIds.add(advisory.id);
  }

  const advisoryList = [];

  // Filter the advisories to get the ones we want.
  const optionalAdvisories = advisories.filter((optional: any) => {
    return optionalAdvisoryIds.has(optional.AdvisoryId);
  });

  // Create an array of advisories.
  for (const advisory of optionalAdvisories) {
    advisoryList.push(advisory.AmendAdvisory.advisory);
  }

  // Join the advisories together with an escaped newline.
  return advisoryList.join('\n\n');
};

/**
 * This function returns a list of optional general conditions.
 *
 * @param {any} conditions The list of conditions associated with the licence.
 * @returns {string} Returns a formatted list of optional general conditions.
 */
const createGeneralConditionsList = async (conditions: any): Promise<string> => {
  // Get all optional conditions from the database.
  const allOptionalConditions = await ConditionController.findAllOptional();

  // Filter so we only have `General` conditions.
  const allOptionalGeneralConditions = allOptionalConditions.filter((condition) => {
    return condition.category === 'General';
  });

  const optionalGeneralConditionIds = new Set();

  // Add the condition IDs to a set.
  for (const condition of allOptionalGeneralConditions) {
    optionalGeneralConditionIds.add(condition.id);
  }

  const conditionList = [];

  // Filter the conditions to get the ones we want.
  const optionalConditions = conditions.filter((optional: any) => {
    return optionalGeneralConditionIds.has(optional.ConditionId);
  });

  // Create an array of conditions.
  for (const condition of optionalConditions) {
    conditionList.push(condition.AmendCondition.condition);
  }

  // Join the conditions together with an escaped newline.
  return conditionList.join('\n\n');
};

/**
 * This function returns a list of optional what you must do conditions.
 *
 * @param {any} conditions The list of conditions associated with the licence.
 * @returns {string} Returns a formatted list of optional what you must do conditions.
 */
const createWhatYouMustDoConditionsList = async (conditions: any): Promise<string> => {
  // Get all optional conditions from the database.
  const allOptionalConditions = await ConditionController.findAllOptional();

  // Filter so we only have `What you must do` conditions.
  const allOptionalWhatYouMustDoConditions = allOptionalConditions.filter((condition) => {
    return condition.category === 'What you must do';
  });

  const optionalWhatMustBeDoneConditionIds = new Set();

  // Add the condition IDs to a set.
  for (const condition of allOptionalWhatYouMustDoConditions) {
    optionalWhatMustBeDoneConditionIds.add(condition.id);
  }

  const conditionList = [];

  // Filter the conditions to get the ones we want.
  const optionalConditions = conditions.filter((optional: any) => {
    return optionalWhatMustBeDoneConditionIds.has(optional.ConditionId);
  });

  // Create an array of conditions.
  for (const condition of optionalConditions) {
    conditionList.push(condition.AmendCondition.condition);
  }

  // Join the conditions together with an escaped newline.
  return conditionList.join('\n\n');
};

/**
 * This function returns a list of optional reporting conditions.
 *
 * @param {any} conditions The list of conditions associated with the licence.
 * @returns {string} Returns a formatted list of optional general conditions.
 */
const createReportingConditionsList = async (conditions: any): Promise<string> => {
  // Get all optional conditions from the database.
  const allOptionalConditions = await ConditionController.findAllOptional();

  // Filter so we only have `Recording and reporting requirements` conditions.
  const allOptionalReportingConditions = allOptionalConditions.filter((condition) => {
    return condition.category === 'Recording and reporting requirements';
  });

  const optionalReportingConditionIds = new Set();

  // Add the condition IDs to a set.
  for (const condition of allOptionalReportingConditions) {
    optionalReportingConditionIds.add(condition.id);
  }

  const conditionList = [];

  // Filter the conditions to get the ones we want.
  const optionalConditions = conditions.filter((optional: any) => {
    return optionalReportingConditionIds.has(optional.ConditionId);
  });

  // Create an array of conditions.
  for (const condition of optionalConditions) {
    conditionList.push(condition.AmendCondition.condition);
  }

  // Join the conditions together with an escaped newline.
  return conditionList.join('\n\n');
};

/**
 * This function creates a list of conservation status details for each species the licence applies to.
 *
 * @param {any} species The species object that contains the species for which the licence will apply.
 * @returns {string} Returns a string with the HTML formatted conservation status of the selected species.
 */
const createConservationStatus = (species: any): string => {
  const conservationStatuses: string[] = [];
  if (species.HerringGullId) {
    conservationStatuses.push('* Herring gull - Red in UK (Amber in Europe and least concern globally)');
  }

  if (species.BlackHeadedGullId) {
    conservationStatuses.push('* Black-headed gull - Amber in UK (Least concern in Europe and globally)');
  }

  if (species.CommonGullId) {
    conservationStatuses.push('* Common gull - Amber in UK (Least concern in Europe and globally)');
  }

  if (species.GreatBlackBackedGullId) {
    conservationStatuses.push('* Great black-backed gull - Amber in UK (Least concern in Europe and globally)');
  }

  if (species.LesserBlackBackedGullId) {
    conservationStatuses.push('* Lesser black-backed gull - Amber in UK (Least concern in Europe and globally)');
  }

  return conservationStatuses.join('\n');
};

/**
 * This function calls the Notify API and asks for an email to be sent to the supplied address.
 *
 * @param {any} emailAddress The email address to send the email to.
 * @param {any} emailDetails The details of the amendment to use with the email.
 */
const sendAmendedEmail = async (emailAddress: string, emailDetails: any) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('9cfcaca5-ef5d-46c4-8ccf-328bcf67ad6d', emailAddress, {
      personalisation: emailDetails,
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
};

const setAmendEmailPersonalisationFields = async (application: any, amendmentDetails: any): Promise<any> => {
  return {
    licenceNumber: application.id,
    siteAddress: MultiUseFunctions.createSummaryAddress(application.SiteAddress),
    startDate: MultiUseFunctions.createDisplayDate(new Date()),
    endDate: MultiUseFunctions.createDisplayDate(application.License.periodTo),
    licenceHolderName: application.LicenceHolder.name,
    licenceHolderAddress: MultiUseFunctions.createSummaryAddress(application.LicenceHolderAddress),
    permittedActivities: createPermittedActivitiesList(amendmentDetails.ASpecies), // Multiple amendments possible.
    advisoryNotes: await createAdvisoriesList(amendmentDetails.AmendAdvisories),
    whatYouMustDoConditionsList: await createWhatYouMustDoConditionsList(amendmentDetails.AmendConditions),
    generalConditionsList: await createGeneralConditionsList(amendmentDetails.AmendConditions),
    reportingConditionsList: await createReportingConditionsList(amendmentDetails.AmendConditions),
    statementReason: amendmentDetails.assessment,
    conservationStatus: createConservationStatus(amendmentDetails.ASpecies),
    hasConditions: amendmentDetails.AmendConditions ? 'yes' : 'no',
  };
};

const AmendmentController = {
  /**
   * This function returns a single amendment by ID.
   *
   * @param {number} id The primary key of the desired amendment.
   * @returns {any} Returns the amendment.
   */
  findOne: async (id: number) => {
    return Amendment.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: ASpecies,
          as: 'ASpecies',
          paranoid: false,
          include: [
            {
              model: AActivity,
              as: 'AHerringGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ABlackHGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ACommonGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'AGreatBBGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ALesserBBGull',
              paranoid: false,
            },
          ],
        },
        {
          model: AmendCondition,
          as: 'AmendConditions',
          paranoid: false,
          include: [
            {
              model: Condition,
              as: 'AmendCondition',
              paranoid: false,
            },
          ],
        },
        {
          model: AmendAdvisory,
          as: 'AmendAdvisories',
          paranoid: false,
          include: [
            {
              model: Advisory,
              as: 'AmendAdvisory',
              paranoid: false,
            },
          ],
        },
      ],
    });
  },

  /**
   * This function gets all amendments for a licence from the database.
   *
   * @param {number} id The id number of the licence in question.
   * @returns {any} Returns all amendments for licence.
   */
  findAllForLicence: async (id: number) => {
    return Amendment.findAll({
      paranoid: false,
      include: [
        {
          model: ASpecies,
          as: 'ASpecies',
          paranoid: false,
          include: [
            {
              model: AActivity,
              as: 'AHerringGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ABlackHGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ACommonGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'AGreatBBGull',
              paranoid: false,
            },
            {
              model: AActivity,
              as: 'ALesserBBGull',
              paranoid: false,
            },
          ],
        },
        {
          model: AmendCondition,
          as: 'AmendConditions',
          paranoid: false,
          include: [
            {
              model: Condition,
              as: 'AmendCondition',
              paranoid: false,
            },
          ],
        },
        {
          model: AmendAdvisory,
          as: 'AmendAdvisories',
          paranoid: false,
          include: [
            {
              model: Advisory,
              as: 'AmendAdvisory',
              paranoid: false,
            },
          ],
        },
      ],
      where: {
        LicenceId: id,
      },
    });
  },

  /**
   * This function gets all amendments from the database.
   *
   * @returns {any} Returns all amendments.
   */
  findAll: async () => {
    return Amendment.findAll();
  },

  /**
   * This function creates a new amendment record in the database.
   *
   * @param {any} incomingAmendment The new amendment.
   * @param {any | undefined} herringAmend Any amendments to herring gull activities.
   * @param {any | undefined} blackHeadedAmend Any amendments to black-headed gull activities.
   * @param {any | undefined} commonAmend Any amendments to common gull activities.
   * @param {any | undefined} greatBlackBackedAmend Any amendments to great black-backed gull activities.
   * @param {any | undefined} lesserBlackBackedAmend Any amendments to lesser black-backed gull activities.
   * @param {ConditionInterface[] | undefined} optionalConditions Amended optional conditions.
   * @param {AdvisoryInterface[] | undefined} optionalAdvisories Amended optional advisories.
   * @returns {AmendmentInterface | undefined} Returns a successfully created amendment, or undefined.
   */
  create: async (
    incomingAmendment: any,
    herringAmend: any | undefined,
    blackHeadedAmend: any | undefined,
    commonAmend: any | undefined,
    greatBlackBackedAmend: any | undefined,
    lesserBlackBackedAmend: any | undefined,
    optionalConditions: ConditionInterface[] | undefined,
    optionalAdvisories: AdvisoryInterface[] | undefined,
  ) => {
    const aSpeciesIds: SpeciesIds = {
      HerringGullId: undefined,
      BlackHeadedGullId: undefined,
      CommonGullId: undefined,
      GreatBlackBackedGullId: undefined,
      LesserBlackBackedGullId: undefined,
    };

    let newAmendment;
    let amendmentId: number | undefined;

    // Start a transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      // Add any species specific activities to the DB and get their IDs.
      if (herringAmend) {
        const herringGull = await AActivity.create(herringAmend, {transaction: t});
        aSpeciesIds.HerringGullId = herringGull.id;
      }

      if (blackHeadedAmend) {
        const blackHeadedGull = await AActivity.create(blackHeadedAmend, {transaction: t});
        aSpeciesIds.BlackHeadedGullId = blackHeadedGull.id;
      }

      if (commonAmend) {
        const commonGull = await AActivity.create(commonAmend, {transaction: t});
        aSpeciesIds.CommonGullId = commonGull.id;
      }

      if (greatBlackBackedAmend) {
        const greatBlackBackedGull = await AActivity.create(greatBlackBackedAmend, {transaction: t});
        aSpeciesIds.GreatBlackBackedGullId = greatBlackBackedGull.id;
      }

      if (lesserBlackBackedAmend) {
        const lesserBlackBackedGull = await AActivity.create(lesserBlackBackedAmend, {transaction: t});
        aSpeciesIds.LesserBlackBackedGullId = lesserBlackBackedGull.id;
      }

      // Set the species foreign keys in the DB.
      const newASpecies = await ASpecies.create(aSpeciesIds, {transaction: t});

      // Set the new species ID of the amendment.
      incomingAmendment.SpeciesId = newASpecies.id;

      // Create the amendment.
      newAmendment = await Amendment.create(incomingAmendment, {transaction: t});

      amendmentId = newAmendment.id;

      if (optionalConditions) {
        await Promise.all(
          optionalConditions.map(async (optionalJsonCondition) => {
            await AmendCondition.create(
              {
                AmendmentId: amendmentId,
                ConditionId: optionalJsonCondition.id,
              },
              {transaction: t},
            );
          }),
        );
      }

      if (optionalAdvisories) {
        await Promise.all(
          optionalAdvisories.map(async (optionalJsonAdvisory) => {
            await AmendAdvisory.create(
              {
                AmendmentId: amendmentId,
                AdvisoryId: optionalJsonAdvisory.id,
              },
              {transaction: t},
            );
          }),
        );
      }

      // Post amendReason to Notes table.
      const amendmentNote = {
        Note: incomingAmendment.amendReason,
        createdBy: incomingAmendment.amendedBy,
        ApplicationId: incomingAmendment.LicenceId,
      };

      await Note.create(amendmentNote, {transaction: t});
    });

    // We need the licence application details to create the amendment email.
    const application = (await ApplicationController.findOne(incomingAmendment.LicenceId)) as any;

    // We need the newly created amendment to create the amendment email.
    let amendmentDetails;
    if (amendmentId) {
      amendmentDetails = (await AmendmentController.findOne(amendmentId)) as any;
    }

    const emailDetails = await setAmendEmailPersonalisationFields(application, amendmentDetails);

    // We need to check if we have any conditions or advisories so we can tell Notify what to show
    // in the email it creates.
    emailDetails.hasWhatYouMustDo = emailDetails.whatYouMustDoConditionsList.length > 0 ? 'yes' : 'no';
    emailDetails.hasRecording = emailDetails.reportingConditionsList.length > 0 ? 'yes' : 'no';
    emailDetails.hasGeneral = emailDetails.generalConditionsList.length > 0 ? 'yes' : 'no';
    emailDetails.hasAdvisoryNotes = emailDetails.advisoryNotes.length > 0 ? 'yes' : 'no';

    // Send Notify email if we have a licence holder email address.
    if (incomingAmendment.licenceHolderEmailAddress) {
      await sendAmendedEmail(incomingAmendment.licenceHolderEmailAddress, emailDetails);
    }

    // Send Notify email if we have a licence applicant email address.
    if (
      incomingAmendment.licenceApplicantEmailAddress &&
      application.LicenceHolderId !== application.LicenceApplicantId
    ) {
      await sendAmendedEmail(incomingAmendment.licenceApplicantEmailAddress, emailDetails);
    }

    await sendAmendedEmail('issuedlicence@nature.scot', emailDetails);

    // If all went well return the new amendment.
    if (newAmendment) {
      return newAmendment as AmendmentInterface;
    }

    // If all did not go well return undefined.
    return undefined;
  },
};

export {AmendmentController as default};
export {AmendmentInterface};
