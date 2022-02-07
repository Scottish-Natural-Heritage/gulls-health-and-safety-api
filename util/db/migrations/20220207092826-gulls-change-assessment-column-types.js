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
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'supportingInformation',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'whenIssue',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'whoAffected',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'howAffected',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'otherIssueInformation',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'measuresTriedDetail',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'measuresWillNotTryDetail',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Revocations',
      },
      'reason',
      {
        type: Sequelize.TEXT,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Withdrawals',
      },
      'reason',
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
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'supportingInformation',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'whenIssue',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'whoAffected',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'howAffected',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Issues',
      },
      'otherIssueInformation',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'measuresTriedDetail',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Measures',
      },
      'measuresWillNotTryDetail',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Revocations',
      },
      'reason',
      {
        type: Sequelize.STRING,
      },
    );
    await queryInterface.changeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Withdrawals',
      },
      'reason',
      {
        type: Sequelize.STRING,
      },
    );
  },
};
