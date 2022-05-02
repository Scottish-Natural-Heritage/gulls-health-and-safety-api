/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'ReturnActivities',
      },
      'RActivities',
    );

    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'ReturnSpecies',
      },
      'RSpecies',
    );
  },

  down: async (queryInterface) => {
    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'RSpecies',
      },
      'ReturnSpecies',
    );

    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'RActivities',
      },
      'ReturnActivities',
    );
  },
};
