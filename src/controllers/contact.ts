import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Contact} = database;

const ContactController = {
  findOne: async (id: number) => {
    return Contact.findByPk(id);
  },

  findAll: async () => {
    return Contact.findAll();
  },

  create: async (contact: any) => {
    const contactId = Math.floor(Math.random() * 99_999);
    contact.id = contactId;
    let newContact: any;
    await database.sequelize.transaction(async (t: transaction) => {
      newContact = await Contact.create(contact, {transaction: t});
    });
    return newContact;
  },
};

export {ContactController as default};
