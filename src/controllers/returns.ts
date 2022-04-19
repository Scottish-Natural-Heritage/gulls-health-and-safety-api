import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Returns, ReturnSpecies, ReturnActivity} = database;

/**
 * Local interface to hold the species IDs used with the foreign keys.
 */
interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

const ReturnsController = {
  /**
   * This function returns a single return by ID.
   *
   * @param {number} id The primary key of the desired return.
   * @returns {any} Returns the return requests.
   */
  findOne: async (id: number) => {
    return Returns.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: ReturnSpecies,
          as: 'ReturnSpecies',
          paranoid: false,
          include: [
            {
              model: ReturnActivity,
              as: 'ReturnHerringGull',
              paranoid: false,
            },
            {
              model: ReturnActivity,
              as: 'ReturnBlackHeadedGull',
              paranoid: false,
            },
            {
              model: ReturnActivity,
              as: 'ReturnCommonGull',
              paranoid: false,
            },
            {
              model: ReturnActivity,
              as: 'ReturnGreatBlackBackedGull',
              paranoid: false,
            },
            {
              model: ReturnActivity,
              as: 'ReturnLesserBlackBackedGull',
              paranoid: false,
            },
          ],
        },
      ],
    });
  },

  /**
   * This function gets all returns from the database.
   *
   * @returns {any} Returns all returns.
   */
  findAll: async () => {
    return Returns.findAll();
  },

  /**
   * .
   * @param {any | undefined} cleanedReturn The cleaned return
   * @param {any | undefined} herringReturnActivity The herring gull activities being returned.
   * @param {any | undefined} blackHeadedReturnActivity The black headed gull activities being returned.
   * @param {any | undefined} commonReturnActivity The common gull activities being returned.
   * @param {any | undefined} greatBlackBackedReturnActivity The great black-backed gull activities being returned.
   * @param {any | undefined} lesserBlackBackedReturnActivity The lesser black-backed gull activities being returned.
   * @returns
   */
  create: async (
    cleanedReturn: any | undefined,
    herringReturnActivity: any | undefined,
    blackHeadedReturnActivity: any | undefined,
    commonReturnActivity: any | undefined,
    greatBlackBackedReturnActivity: any | undefined,
    lesserBlackBackedReturnActivity: any | undefined,
  ) => {
    const speciesIds: SpeciesIds = {
      HerringGullId: undefined,
      BlackHeadedGullId: undefined,
      CommonGullId: undefined,
      GreatBlackBackedGullId: undefined,
      LesserBlackBackedGullId: undefined,
    };

    let newReturn;

    // Add the returns for each species to the database, keeping a copy of the species ID.
    await database.sequelize.transaction(async (t: transaction) => {
      if (herringReturnActivity) {
        const herringGull = await ReturnActivity.create(herringReturnActivity, {transaction: t});
        speciesIds.HerringGullId = herringGull.id;
      }

      if (blackHeadedReturnActivity) {
        const blackHeadedGull = await ReturnActivity.create(blackHeadedReturnActivity, {transaction: t});
        speciesIds.BlackHeadedGullId = blackHeadedGull.id;
      }

      if (commonReturnActivity) {
        const commonGull = await ReturnActivity.create(commonReturnActivity, {transaction: t});
        speciesIds.CommonGullId = commonGull.id;
      }

      if (greatBlackBackedReturnActivity) {
        const greatBlackBackedGull = await ReturnActivity.create(greatBlackBackedReturnActivity, {transaction: t});
        speciesIds.GreatBlackBackedGullId = greatBlackBackedGull.id;
      }

      if (lesserBlackBackedReturnActivity) {
        const lesserBlackBackedGull = await ReturnActivity.create(lesserBlackBackedReturnActivity, {transaction: t});
        speciesIds.LesserBlackBackedGullId = lesserBlackBackedGull.id;
      }

      // Set the return's species foreign keys in the DB.
      const newReturnSpecies = await ReturnSpecies.create(speciesIds, {transaction: t});

      // Set the return's species foreign key.
      cleanedReturn.SpeciesId = newReturnSpecies.id;

      // Add the return to the database.
      newReturn = await Returns.create(cleanedReturn, {transaction: t});
    });

    // Do the email stuff here.

    return newReturn;
  },
};

export {ReturnsController as default};
