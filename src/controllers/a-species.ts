import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {ASpecies} = database;

const ASpeciesController = {
  findOne: async (id: number) => {
    return ASpecies.findByPk(id);
  },

  findAll: async () => {
    return ASpecies.findAll();
  },

  create: async (amendSpecies: any) => {
    let newAmendSpecies;
    await database.sequelize.transaction(async (t: transaction) => {
      newAmendSpecies = await ASpecies.create(amendSpecies, {transaction: t});
    });
    return newAmendSpecies;
  },
};

export {ASpeciesController as default};
