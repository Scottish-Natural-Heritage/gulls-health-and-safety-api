/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Addresses',
      },
      'uprn',
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Addresses',
      },
      'uprn',
      Sequelize.STRING,
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Addresses',
      },
      'uprn',
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Addresses',
      },
      'uprn',
      Sequelize.INTEGER,
    );
  },
};
