/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'confirmedAt',
      Sequelize.DATE,
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'confirmedAt',
    );
  },
};
