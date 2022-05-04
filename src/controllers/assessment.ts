import {AssessmentInterface} from 'models/assessment.js';
import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Assessment, AssessmentMeasure} = database;

const AssessmentController = {
  findOne: async (id: number) => {
    return Assessment.findByPk(id);
  },

  findAll: async () => {
    return Assessment.findAll();
  },

  /**
   * Upsert a assessment of an application. The Upsert method will look for the existence of the assessment by the primary key
   * if it exists then it will update the assessment record with the partial object but if it does not then it will create a new assessment
   * record in the database.
   *
   * @param {AssessmentInterface} assessment The partial assessment object.
   * @param {number} applicationId The ID of the application that is being assessed.
   * @param {any} additionalMeasures The additional assessment measures that have been asked in test 2 object.
   * @returns {boolean} If the assessment was upserted or undefined if something went wrong.
   */
  upsert: async (
    assessment: AssessmentInterface,
    applicationId: number,
    additionalMeasures?: any,
  ): Promise<boolean> => {
    assessment.ApplicationId = applicationId;

    const updateOrCreateAssessment = await database.sequelize.transaction(async (t: transaction) => {
      // It will look at the database to find a record with a primary key that matches the applicationId param.
      // If it finds one then it will update the data otherwise it will create a new record.
      const item = await Assessment.upsert(assessment, {returning: true, transaction: t});
      // If we have additionalMeasures then we need to create a new record if not we carry on.
      if (additionalMeasures) {
        additionalMeasures.ApplicationId = applicationId;
        await AssessmentMeasure.upsert(additionalMeasures, {transaction: t});
      }

      // Return the upsert object.
      return item;
    });

    // If a record was created/updated return true.
    if (updateOrCreateAssessment) {
      return true;
    }

    // Something went wrong so return false.
    return false;
  },
};

export {AssessmentController as default};
