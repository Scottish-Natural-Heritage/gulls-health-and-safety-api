/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'siteType',
    );
    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'SiteCategoriesId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'SiteCategories',
          key: 'id',
        },
      },
    );
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'SiteCategoriesId',
    );
    await queryInterface.addColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'siteTypes',
      Sequelize.STRING,
    );
  },
};
