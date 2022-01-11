import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {License, PermittedSpecies, PermittedActivity, LicenseCondition, LicenseAdvisory, Advisory, Condition} = database;

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
interface LicenseInterface {
  ApplicationId: number;
  periodFrom: string;
  periodTo: string;
  licenseDetails: string;
  PermittedSpeciesId: number;
}

const LicenseController = {
  findOne: async (id: number) => {
    return License.findByPk(id, {
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
          model: LicenseCondition,
          as: 'LicenseCondition',
        },
        {
          model: LicenseAdvisory,
          as: 'LicenseAdvisory',
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
   * @param {any | undefined} herringActivity The herring gull activities to be licensed.
   * @param {any | undefined} blackHeadedActivity The black-headed gull activities to be licensed.
   * @param {any | undefined} commonActivity The common gull activities to be licensed.
   * @param {any | undefined} greatBlackBackedActivity The great black-backed gull activities to be licensed.
   * @param {any | undefined} lesserBlackBackedActivity The lesser black-backed gull activities to be licensed.
   * @param {any | undefined} incomingLicense The License details.
   * @returns {any} Returns newLicense, the newly created License.
   */
  create: async (
    applicationId: any,
    herringActivity: any | undefined,
    blackHeadedActivity: any | undefined,
    commonActivity: any | undefined,
    greatBlackBackedActivity: any | undefined,
    lesserBlackBackedActivity: any | undefined,
    incomingLicense: any,
  ) => {
    const speciesIds: PermittedSpeciesIds = {
      HerringGullId: undefined,
      BlackHeadedGullId: undefined,
      CommonGullId: undefined,
      GreatBlackBackedGullId: undefined,
      LesserBlackBackedGullId: undefined,
    };
    let newLicense;
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

      incomingLicense.ApplicationId = applicationId;
      incomingLicense.PermittedSpeciesId = newPermittedSpecies.id;

      // Add the Licence to the DB.
      newLicense = await License.create(incomingLicense, {transaction: t});

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
    });

    // If all went well and we have a new application return it.
    if (newLicense) {
      return newLicense;
    }

    // If no new application was added to the DB return undefined.
    return undefined;
  },
};

export {LicenseController as default};
export {LicenseInterface};
