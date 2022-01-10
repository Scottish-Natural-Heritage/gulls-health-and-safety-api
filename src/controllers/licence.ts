import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import config from '../config/app';

const {Licence, PermittedSpecies, PermittedActivity, LicensedCondition, LicensedAdvisory, Advisory, Condition} =
  database;

/**
 * Local interface to hold the permitted species ID foreign keys.
 */
interface PermittedSpeciesIds {
  HerringGullId: number | undefined;
  BlackHeadedGullId: number | undefined;
  CommonGullId: number | undefined;
  GreatBlackBackedGullId: number | undefined;
  LesserBlackBackedGullId: number | undefined;
}

/**
 * Local interface of the application.
 */
interface LicenceInterface {
  ApplicationId: number;
  periodFrom: string;
  periodTo: string;
  licenceDetails: string;
  PermittedSpeciesId: number;
}

const LicenceController = {
  findOne: async (id: number) => {
    return Licence.findByPk(id, {
      include: [
        {
          model: PermittedSpecies,
          as: 'PermittedSpecies',
          include: [
            {
              model: PermittedActivity,
              as: 'HerringGull',
            },
            {
              model: PermittedActivity,
              as: 'BlackHeadedGull',
            },
            {
              model: PermittedActivity,
              as: 'CommonGull',
            },
            {
              model: PermittedActivity,
              as: 'GreatBlackBackedGull',
            },
            {
              model: PermittedActivity,
              as: 'LesserBlackBackedGull',
            },
          ],
        },
        {
          model: LicensedCondition,
          as: 'LicensedCondition',
        },
        {
          model: LicensedAdvisory,
          as: 'LicensedAdvisory',
        },
      ],
    });
  },

  findAll: async () => {
    return Licence.findAll();
  },

  /**
   * The create function writes the incoming licence to the appropriate database tables.
   *
   * @param {any } applicationId The application that the licence will be based on.
   * @param {any | undefined} herringActivity The herring gull activities to be licensed.
   * @param {any | undefined} blackHeadedActivity The black-headed gull activities to be licensed.
   * @param {any | undefined} commonActivity The common gull activities to be licensed.
   * @param {any | undefined} greatBlackBackedActivity The great black-backed gull activities to be licensed.
   * @param {any | undefined} lesserBlackBackedActivity The lesser black-backed gull activities to be licensed.
   * @param {any | undefined} incomingLicence The Licence details.
   * @returns {any} Returns newLicence, the newly created Licence.
   */
  create: async (
    applicationId: any,
    herringActivity: any | undefined,
    blackHeadedActivity: any | undefined,
    commonActivity: any | undefined,
    greatBlackBackedActivity: any | undefined,
    lesserBlackBackedActivity: any | undefined,
    incomingLicence: any,
  ) => {
    const speciesIds: PermittedSpeciesIds = {
      HerringGullId: undefined,
      BlackHeadedGullId: undefined,
      CommonGullId: undefined,
      GreatBlackBackedGullId: undefined,
      LesserBlackBackedGullId: undefined,
    };
    let newLicence;
    // Start a transaction.
    await database.sequelize.transaction(async (t: transaction) => {
      // Add any species specific activities to the DB and get their IDs.
      if (herringActivity) {
        const herringGull = await PermittedActivity.create(herringActivity, {transaction: t});
        speciesIds.HerringGullId = herringGull.id;
      }

      if (blackHeadedActivity) {
        const blackHeadedGull = await PermittedActivity.create(blackHeadedActivity, {transaction: t});
        speciesIds.BlackHeadedGullId = blackHeadedGull.id;
      }

      if (commonActivity) {
        const commonGull = await PermittedActivity.create(commonActivity, {transaction: t});
        speciesIds.CommonGullId = commonGull.id;
      }

      if (greatBlackBackedActivity) {
        const greatBlackBackedGull = await PermittedActivity.create(greatBlackBackedActivity, {transaction: t});
        speciesIds.GreatBlackBackedGullId = greatBlackBackedGull.id;
      }

      if (lesserBlackBackedActivity) {
        const lesserBlackBackedGull = await PermittedActivity.create(lesserBlackBackedActivity, {transaction: t});
        speciesIds.LesserBlackBackedGullId = lesserBlackBackedGull.id;
      }

      // Set the species foreign keys in the DB.
      const newPermittedSpecies = await PermittedSpecies.create(speciesIds, {transaction: t});

      incomingLicence.ApplicationId = applicationId;
      incomingLicence.PermittedSpeciesId = newPermittedSpecies.id;

      // Add the Licence to the DB.
      newLicence = await Licence.create(incomingLicence, {transaction: t});

      const conditions = await Condition.findAll();
      const advisories = await Advisory.findAll();
      // Add any conditions to the DB.
      await Promise.all(
        conditions.map(async (jsonCondition) => {
          await LicensedCondition.create(
            {
              LicenceId: applicationId,
              ConditionId: jsonCondition.Id,
            },
            {transaction: t},
          );
        }),
      );
      // Add any advisories to the DB.
      await Promise.all(
        advisories.map(async (jsonAdvisory) => {
          await LicensedAdvisory.create(
            {
              LicenceId: applicationId,
              AdvisoryId: jsonAdvisory.Id,
            },
            {transaction: t},
          );
        }),
      );
    });

    // If all went well and we have a new application return it.
    if (newLicence) {
      return newLicence;
    }

    // If no new application was added to the DB return undefined.
    return undefined;
  },
};

export {LicenceController as default};
export {LicenceInterface};
