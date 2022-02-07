/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testOneAssessment',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testTwoAssessment',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'refusalReason',
      {
        type: Sequelize.TEXT,
      },
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testOneAssessment',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testTwoAssessment',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'refusalReason',
      {
        type: Sequelize.STRING,
      },
    );
  },
};
