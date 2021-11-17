import transaction from 'sequelize/types/lib/transaction';
import database from '../models/index.js';

const {Issue} = database;

const IssueController = {
  findOne: async (id: number) => {
    return Issue.findByPk(id);
  },

  findAll: async () => {
    return Issue.findAll();
  },

  create: async (issue: any) => {
    let newIssue: any;
    await database.sequelize.transaction(async (t: transaction) => {
      newIssue = await Issue.create(issue, {transaction: t});
    });
    return newIssue;
  },
};

export {IssueController as default};
