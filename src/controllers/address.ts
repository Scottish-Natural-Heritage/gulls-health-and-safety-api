import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Address, Application} = database;

interface AddressInterface {
  id: number;
  addressLine1: string;
  addressLine2: string;
  addressTown: string;
  addressCounty: string;
  postcode: string;
}

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
          returning: true,
          transaction: t,
        },
      );
    });

    if (newAddress) {
      return newAddress as AddressInterface;
    }

    return undefined;
  },

  update: async (address: any, addressId: number) => {
    let editedAddress;
    await database.sequelize.transaction(async (t: transaction) => {
      editedAddress = await Address.update(address, {where: {id: addressId}, returning: true, transaction: t});
    });

    if (editedAddress) {
      return editedAddress as AddressInterface;
    }

    return undefined;
  },
};

export {AddressController as default};
