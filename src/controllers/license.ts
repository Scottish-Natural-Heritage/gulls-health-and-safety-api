import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import {AdvisoryInterface} from '../models/advisory.js';
import {ConditionInterface} from '../models/condition.js';

const {License, LicenseCondition, LicenseAdvisory, Advisory, Condition} = database;

/**
 * Local interface of the application.
 */
interface LicenseInterface {
  ApplicationId: number;
  periodFrom: string;
  periodTo: string;
}

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
