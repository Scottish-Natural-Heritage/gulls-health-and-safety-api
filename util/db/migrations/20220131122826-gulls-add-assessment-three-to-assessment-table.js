/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testThreeAssessment',
      Sequelize.TEXT,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testThreeDecision',
      Sequelize.BOOLEAN,
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testThreeAssessment',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Assessments',
      },
      'testThreeDecision',
    );
  },
};
