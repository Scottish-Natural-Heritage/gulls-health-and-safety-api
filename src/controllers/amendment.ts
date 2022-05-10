import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import config from '../config/app';
import {AdvisoryInterface} from '../models/advisory.js';
import {ConditionInterface} from '../models/condition.js';

const {Amendment, ASpecies, AActivity, AmendCondition, AmendAdvisory, Condition, Advisory} = database;

interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

interface AmendmentInterface {
  id: number;
  amendReason: string;
  amendedBy: string;
  assessment: string;
}

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
    });

    if (newAmendment) {
      return newAmendment as AmendmentInterface;
    }

    return undefined;
  },
};

export {AmendmentController as default};
export {AmendmentInterface};
