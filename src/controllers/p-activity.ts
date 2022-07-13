import {PActivityInterface} from 'models/p-activity.js';
import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {PActivity, PSpecies} = database;

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

  addNewSpecies: async (activity: any, speciesType: string, id: any) => {
    const newActivityAndUpdatedSpecies = await database.sequelize.transaction(async (t: transaction) => {
      const newActivity = await PActivity.create(activity, {transaction: t});

      let item;
      // prettier-ignore
      switch (speciesType) {
        case 'HerringGull':
          item = await PSpecies.update({HerringGullId: newActivity.id}, {where: {id}, returning: true, transaction: t});
          break;
        case 'BlackHeadedGull':
          item = await PSpecies.update({BlackHeadedGullId: newActivity.id}, {where: {id}, returning: true, transaction: t});
          break;
        case 'CommonGull':
          item = await PSpecies.update({CommonGullId: newActivity.id}, {where: {id}, returning: true, transaction: t});
          break;
        case 'GreatBlackBackedGull':
          item = await PSpecies.update({GreatBlackBackedGullId: newActivity.id}, {where: {id}, returning: true, transaction: t});
          break;
        case 'LesserBlackBackedGull':
          item = await PSpecies.update({LesserBlackBackedGullId: newActivity.id}, {where: {id}, returning: true, transaction: t});
          break;
        default:
          item = undefined;
          break;
      }

      return item;
    });
    // If a record was updated return true.
    if (newActivityAndUpdatedSpecies) {
      return true;
    }

    // Something went wrong so return false.
    return false;
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
