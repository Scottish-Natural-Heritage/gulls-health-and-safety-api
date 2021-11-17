import database from '../models/index.js';

const {Species} = database;

const SpeciesController = {
  findOne: async (id: number) => {
    return Species.findByPk(id);
  },

  findAll: async () => {
    return Species.findAll();
  },
};

export {SpeciesController as default};
