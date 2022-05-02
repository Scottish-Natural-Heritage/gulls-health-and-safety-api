import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {AssessmentMeasure} = database;

const MeasureController = {
  findOne: async (id: number) => {
    return AssessmentMeasure.findByPk(id);
  },

  findAll: async () => {
    return AssessmentMeasure.findAll();
  },

  create: async (assessmentMeasure: any) => {
    let newAssessmentMeasure;
    await database.sequelize.transaction(async (t: transaction) => {
      newAssessmentMeasure = await AssessmentMeasure.create(assessmentMeasure, {transaction: t});
    });
    return newAssessmentMeasure;
  },
};

export {MeasureController as default};
