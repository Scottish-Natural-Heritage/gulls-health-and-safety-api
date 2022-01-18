import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Advisory} = database;

const AdvisoryController = {
  findOne: async (id: number) => {
    return Advisory.findByPk(id);
  },

  findAll: async () => {
    return Advisory.findAll();
  },

  findAllDefault: async () => {
    return Advisory.findAll({where: {default: true}});
  },

  findAllOptional: async () => {
    return Advisory.findAll({where: {default: false}});
  },

  create: async (Advisory: any) => {
    let newAdvisory;
    await database.sequelize.transaction(async (t: transaction) => {
      newAdvisory = await Advisory.create(Advisory, {transaction: t});
    });
    return newAdvisory;
  },
};

export {AdvisoryController as default};
