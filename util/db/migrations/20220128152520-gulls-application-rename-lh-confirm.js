/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'confirmedByLicensingHolder',
      'confirmedByLicenseHolder',
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      {
        schema: databaseConfig.database.schema,
        tableName: 'Applications',
      },
      'confirmedByLicenseHolder',
      'confirmedByLicensingHolder',
    );
  },
};
