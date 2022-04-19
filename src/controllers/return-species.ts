import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {ReturnSpecies} = database;

const ReturnSpeciesController = {
  findOne: async (id: number) => {
    return ReturnSpecies.findByPk(id);
  },

  findAll: async () => {
    return ReturnSpecies.findAll();
  },

  create: async (returnSpecies: any) => {
    let newReturnSpecies;
    await database.sequelize.transaction(async (t: transaction) => {
      newReturnSpecies = await ReturnSpecies.create(returnSpecies, {transaction: t});
    });
    return newReturnSpecies;
  },
};

export {ReturnSpeciesController as default};
