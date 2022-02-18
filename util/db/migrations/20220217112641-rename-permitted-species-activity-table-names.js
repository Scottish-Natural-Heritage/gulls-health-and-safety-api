/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'PermittedActivities',
      },
      'PActivities',
    );

    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'PermittedSpecies',
      },
      'PSpecies',
    );
  },

  down: async (queryInterface) => {
    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'PSpecies',
      },
      'PermittedSpecies',
    );

    await queryInterface.renameTable(
      {
        schema: databaseConfig.database.schema,
        tableName: 'PActivities',
      },
      'PermittedActivities',
    );
  },
};
