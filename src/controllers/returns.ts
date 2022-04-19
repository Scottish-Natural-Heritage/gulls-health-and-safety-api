import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Returns, ReturnSpecies, ReturnActivity} = database;

interface SpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

const ReturnsController = {
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

  findAll: async () => {
    return Returns.findAll();
  },

  create: async (
    cleanedReturn: any | undefined,
    herringReturnActivity: any | undefined,
    blackReturnHeadedActivity: any | undefined,
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

    await database.sequelize.transaction(async (t: transaction) => {
      if (herringReturnActivity) {
        const herringGull = await ReturnActivity.create(herringReturnActivity, {transaction: t});
        speciesIds.HerringGullId = herringGull.id;
      }

      if (blackReturnHeadedActivity) {
        const blackHeadedGull = await ReturnActivity.create(blackReturnHeadedActivity, {transaction: t});
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
