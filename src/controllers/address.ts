import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Address, Application} = database;

const AddressController = {
  findOne: async (id: number) => {
    return Address.findByPk(id);
  },

  findAll: async () => {
    return Address.findAll();
  },

  create: async (address: any, applicationId: number) => {
    let newAddress;
    await database.sequelize.transaction(async (t: transaction) => {
      // Add a new address entry to the database.
      newAddress = await Address.create(address, {transaction: t});

      // Having created a new address entry we need to update the ID in the application.
      await Application.update(
        {
          LicenceHolderAddressId: newAddress.id,
        },
        {
          where: {id: applicationId},
        },
      );
    });

    return newAddress;
  },

  update: async (address: any, addressId: number) => {
    let editedAddress;
    await database.sequelize.transaction(async (t: transaction) => {
      editedAddress = await Address.update(address, {where: {id: addressId}});
    });

    return editedAddress;
  },
};

export {AddressController as default};
