import database from '../models/index.js';

const {Activity} = database;

const ActivityController = {
  findOne: async (id: number) => {
    return Activity.findByPk(id);
  },

  findAll: async () => {
    return Activity.findAll();
  },
};

export {ActivityController as default};
