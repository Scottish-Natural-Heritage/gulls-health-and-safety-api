import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Condition} = database;

const ConditionController = {
  findOne: async (id: number) => {
    return Condition.findByPk(id);
  },

  findAll: async () => {
    return Condition.findAll();
  },

  findAllDefault: async () => {
    return Condition.findAll({where: {default: true}});
  },

  findAllOptional: async () => {
    return Condition.findAll({where: {default: false}});
  },

  create: async (Condition: any) => {
    let newCondition;
    await database.sequelize.transaction(async (t: transaction) => {
      newCondition = await Condition.create(Condition, {transaction: t});
    });
    return newCondition;
  },
};

export {ConditionController as default};
