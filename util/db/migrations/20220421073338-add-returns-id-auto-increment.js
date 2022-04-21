/* eslint-disable unicorn/prefer-module */

const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'id',
      {
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'id',
      {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    );
  },
};
