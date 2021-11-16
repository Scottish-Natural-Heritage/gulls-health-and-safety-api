import database from '../models/index.js';

const {Application, Contact, Address} = database;

const ApplicationController = {
  findOne: async (id: number) => {
    return Application.findByPk(id);
  },

  findAll: async () => {
    return Application.findAll({
      include: [
        {
          model: Contact,
          as: 'LicenceHolderId'
        },
        {
          model: Contact,
          as: 'LicenceApplicantId'
        },
        {
          model: Address,
          as: 'LicenceHolderAddressId'
        },
        {
          model: Address,
          as: 'LicenceHolderAddressId'
        }
      ]
    }
    );
  },

}

export {ApplicationController as default};
