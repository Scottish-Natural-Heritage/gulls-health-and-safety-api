import database from '../models/index.js';

const {Issue} = database;

const IssueController = {
  findOne: async (id: number) => {
    return Issue.findByPk(id);
  },

  findAll: async () => {
    return Issue.findAll();
  },
}

export {IssueController as default};
