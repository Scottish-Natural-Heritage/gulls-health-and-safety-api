import transaction from 'sequelize/types/transaction';
import database from '../models/index.js';

const {Measure} = database;

const MeasureController = {
  findOne: async (id: number) => {
    return Measure.findByPk(id);
  },

  findAll: async () => {
    return Measure.findAll();
  },

  create: async (measure: any) => {
    let newMeasure;
    await database.sequelize.transaction(async (t: transaction) => {
      newMeasure = await Measure.create(measure, {transaction: t});
    });
    return newMeasure;
  },
};

export {MeasureController as default};
