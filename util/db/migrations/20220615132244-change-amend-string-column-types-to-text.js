/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Amendments',
      },
      'amendReason',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Amendments',
      },
      'assessment',
      {
        type: Sequelize.TEXT,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Amendments',
      },
      'assessment',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Amendments',
      },
      'amendReason',
      {
        type: Sequelize.STRING,
      },
    );
  },
};
