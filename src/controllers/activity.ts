import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Activity} = database;

const ActivityController = {
  findOne: async (id: number) => {
    return Activity.findByPk(id);
  },

  findAll: async () => {
    return Activity.findAll();
  },

  create: async (activity: any) => {
    let newActivity: any;
    await database.sequelize.transaction(async (t: transaction) => {
      newActivity = await Activity.create(activity, {transaction: t});
    });
    return newActivity;
  },
};

export {ActivityController as default};
