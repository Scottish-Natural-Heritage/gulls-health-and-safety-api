'use strict';

const databaseConfig = require('../database.js');

module.exports = {
  async up(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'isResidentialSite',
        {transaction: t},
      );

      await queryInterface.removeColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'siteType',
        {transaction: t},
      );
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'isResidentialSite',
        Sequelize.BOOLEAN,
        {transaction: t},
      );

      await queryInterface.addColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'siteType',
        Sequelize.STRING,
        {transaction: t},
      );
    });
  },
};
