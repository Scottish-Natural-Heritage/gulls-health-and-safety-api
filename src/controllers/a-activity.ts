import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {AActivity} = database;

const AActivityController = {
  findOne: async (id: number) => {
    return AActivity.findByPk(id);
  },

  findAll: async () => {
    return AActivity.findAll();
  },

  create: async (amendActivity: any) => {
    let newAmendActivity;
    await database.sequelize.transaction(async (t: transaction) => {
      newAmendActivity = await AActivity.create(amendActivity, {transaction: t});
    });
    return newAmendActivity;
  },
};

export {AActivityController as default};
