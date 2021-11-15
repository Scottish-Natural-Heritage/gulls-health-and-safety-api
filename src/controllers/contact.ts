import database from '../models/index.js';

const {Contact} = database;

const ContactController = {
  findOne: async (id: number) => {
    return Contact.findByPk(id);
  },

  findAll: async () => {
    return Contact.findAll();
  },
}

export {ContactController as default};
