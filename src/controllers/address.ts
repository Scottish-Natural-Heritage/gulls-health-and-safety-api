import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Address} = database;

const AddressController = {
  findOne: async (id: number) => {
    return Address.findByPk(id);
  },

  findAll: async () => {
    return Address.findAll();
  },

  create: async (address: any) => {
    let newAddress: any;
    await database.sequelize.transaction(async (t: transaction) => {
      newAddress = await Address.create(address, {transaction: t});
    });
    return newAddress;
  },
};

export {AddressController as default};
