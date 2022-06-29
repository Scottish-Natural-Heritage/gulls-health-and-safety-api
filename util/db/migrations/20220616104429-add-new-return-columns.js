/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'name',
      Sequelize.STRING,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'isReportingReturn',
      Sequelize.BOOLEAN,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'isSiteVisitReturn',
      Sequelize.BOOLEAN,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'isFinalReturn',
      Sequelize.BOOLEAN,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'siteVisitDate',
      Sequelize.DATE,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'hasTriedPreventativeMeasures',
      Sequelize.BOOLEAN,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'preventativeMeasuresDetails',
      Sequelize.TEXT,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'wasCompliant',
      Sequelize.BOOLEAN,
    );

    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'complianceDetails',
      Sequelize.TEXT,
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'name',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'isReportingReturn',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'isSiteVisitReturn',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'isFinalReturn',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'siteVisitDate',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'hasTriedPreventativeMeasures',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'preventativeMeasuresDetails',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'wasCompliant',
    );

    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Returns',
      },
      'complianceDetails',
    );
  },
};
