import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import {AdvisoryInterface} from '../models/advisory.js';
import {ConditionInterface} from '../models/condition.js';
import config from '../config/app';

const {Amendment, ASpecies, AActivity, AmendCondition, AmendAdvisory, Condition, Advisory, Note} = database;

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
 * This function calls the Notify API and asks for an email to be sent to the supplied address.
 *
 * @param {any} emailAddress The email address to send the email to.
 */
 const sendAmendedEmail = async (emailAddress: string) => {
  if (config.notifyApiKey) {
    const notifyClient = new NotifyClient(config.notifyApiKey);
    await notifyClient.sendEmail('9cfcaca5-ef5d-46c4-8ccf-328bcf67ad6d', emailAddress, {
      emailReplyToId: '4b49467e-2a35-4713-9d92-809c55bf1cdd',
    });
  }
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
        },
        {
          model: AmendAdvisory,
          as: 'AmendAdvisories',
        },
      ],
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

      const amendmentId = newAmendment.id;

      // Fetch all the default conditions.
      const conditions = await Condition.findAll({where: {default: true}});
      const advisories = await Advisory.findAll({where: {default: true}});
      // Add any conditions to the DB.
      await Promise.all(
        conditions.map(async (jsonCondition) => {
          await AmendCondition.create(
            {
              AmendmentId: amendmentId,
              ConditionId: jsonCondition.id,
            },
            {transaction: t},
          );
        }),
      );
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

      // Add any advisories to the DB.
      await Promise.all(
        advisories.map(async (jsonAdvisory) => {
          await AmendAdvisory.create(
            {
              AmendmentId: amendmentId,
              AdvisoryId: jsonAdvisory.id,
            },
            {transaction: t},
          );
        }),
      );

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
        ApplicationId: incomingAmendment.LicenceId
      }

      await Note.create(amendmentNote, {transaction: t});
    });

    // Send Notify email.
    await sendAmendedEmail(incomingAmendment.licenceHolderEmailAddress);

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
