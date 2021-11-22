import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Species} = database;

const SpeciesController = {
  findOne: async (id: number) => {
    return Species.findByPk(id);
  },

  findAll: async () => {
    return Species.findAll();
  },

  create: async (species: any) => {
    let newSpecies;
    await database.sequelize.transaction(async (t: transaction) => {
      newSpecies = await Species.create(species, {transaction: t});
    });
    return newSpecies;
  },
};

export {SpeciesController as default};
