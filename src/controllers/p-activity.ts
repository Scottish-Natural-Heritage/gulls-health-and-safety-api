import {PActivityInterface} from 'models/p-activity.js';
import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {PActivity} = database;

const PActivityController = {
  findOne: async (id: number) => {
    return PActivity.findByPk(id);
  },

  findAll: async () => {
    return PActivity.findAll();
  },

  create: async (activity: any) => {
    let newActivity;
    await database.sequelize.transaction(async (t: transaction) => {
      newActivity = await PActivity.create(activity, {transaction: t});
    });
    return newActivity;
  },

  update: async (id: number, activity: PActivityInterface) => {
    const updatedActivity = await database.sequelize.transaction(async (t: transaction) => {
      // Save the new values to the database.
      const item = await PActivity.update(activity, {where: {id}, returning: true, transaction: t});

      return item;
    });
    // If a record was updated return true.
    if (updatedActivity) {
      return true;
    }

    // Something went wrong so return false.
    return false;
  },
};

export {PActivityController as default};
