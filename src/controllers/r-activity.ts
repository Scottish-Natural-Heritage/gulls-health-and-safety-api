import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {RActivity} = database;

const RActivityController = {
  findOne: async (id: number) => {
    return RActivity.findByPk(id);
  },

  findAll: async () => {
    return RActivity.findAll();
  },

  create: async (returnActivity: any) => {
    let newReturnActivity;
    await database.sequelize.transaction(async (t: transaction) => {
      newReturnActivity = await RActivity.create(returnActivity, {transaction: t});
    });
    return newReturnActivity;
  },
};

export {RActivityController as default};
