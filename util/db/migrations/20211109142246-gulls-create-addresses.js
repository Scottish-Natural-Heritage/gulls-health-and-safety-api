'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uprn: {
        type: Sequelize.STRING,
      },
      addressLine1: {
        type: Sequelize.STRING
      },
      addressLine2: {
        type: Sequelize.STRING,
      },
      addressTown: {
        type: Sequelize.STRING
      },
      addressCounty: {
        type: Sequelize.STRING
      },
      postcode: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Addresses');
  }
};
