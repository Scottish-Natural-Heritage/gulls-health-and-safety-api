import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';
import {ContactInterface} from '../models/contact.js';

const {Contact} = database;

const ContactController = {
  findOne: async (id: number) => {
    return Contact.findByPk(id);
  },

  findAll: async () => {
    return Contact.findAll();
  },

  create: async (contact: any) => {
    let newContact;
    await database.sequelize.transaction(async (t: transaction) => {
      newContact = await Contact.create(contact, {transaction: t});
    });
    return newContact;
  },

  update: async (id: number, contact: ContactInterface) => {
    const updatedContact = await database.sequelize.transaction(async (t: transaction) => {
      // Save the new values to the database.
      const item = await Contact.update(contact, {where: {id}, returning: true, transaction: t});

      return item;
    });
    // If a record was updated return true.
    if (updatedContact) {
      return true;
    }

    // Something went wrong so return false.
    return false;
  },
};

export {ContactController as default};
