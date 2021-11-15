import database from '../models/index.js';

const {Address} = database;

const AddressController = {
  findOne: async (id: number) => {
    return Address.findByPk(id);
  },

  findAll: async () => {
    return Address.findAll();
  },
}

export {AddressController as default};
