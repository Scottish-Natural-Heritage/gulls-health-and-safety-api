/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'ppe',
      Sequelize.STRING,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'measuresIntendDetail',
      Sequelize.STRING,
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'measuresIntendDetail',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'ppe',
    );
  },
};
