'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Applications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      test1: {
        type: Sequelize.BOOLEAN
      },
      test2: {
        type: Sequelize.BOOLEAN
      },
      test3: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Applications');
  }
};
