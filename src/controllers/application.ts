import database from '../models/index.js';

const {Application} = database;

const ApplicationController = {
  findOne: async (id: number) => {
    return Application.findByPk(id);
  },

  findAll: async () => {
    return Application.findAll();
  },
};

export {ApplicationController as default};
