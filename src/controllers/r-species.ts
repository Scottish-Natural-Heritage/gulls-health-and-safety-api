import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {RSpecies} = database;

const RSpeciesController = {
  findOne: async (id: number) => {
    return RSpecies.findByPk(id);
  },

  findAll: async () => {
    return RSpecies.findAll();
  },

  create: async (returnSpecies: any) => {
    let newReturnSpecies;
    await database.sequelize.transaction(async (t: transaction) => {
      newReturnSpecies = await RSpecies.create(returnSpecies, {transaction: t});
    });
    return newReturnSpecies;
  },
};

export {RSpeciesController as default};
