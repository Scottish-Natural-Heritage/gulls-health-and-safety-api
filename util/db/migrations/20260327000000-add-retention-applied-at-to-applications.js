/* eslint-disable unicorn/prefer-module */

const databaseConfig = require('../database.js');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'retentionAppliedAt',
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        {transaction: t},
      );
    });
  },

  async down(queryInterface, _Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'retentionAppliedAt',
        {transaction: t},
      );
    });
  },
};
