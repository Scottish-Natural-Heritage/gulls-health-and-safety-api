import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {ReturnActivity} = database;

const ReturnActivityController = {
  findOne: async (id: number) => {
    return ReturnActivity.findByPk(id);
  },

  findAll: async () => {
    return ReturnActivity.findAll();
  },

  create: async (returnActivity: any) => {
    let newReturnActivity;
    await database.sequelize.transaction(async (t: transaction) => {
      newReturnActivity = await ReturnActivity.create(returnActivity, {transaction: t});
    });
    return newReturnActivity;
  },
};

export {ReturnActivityController as default};
