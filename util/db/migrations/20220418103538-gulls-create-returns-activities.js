/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReturnActivities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      removeNests: {
        type: Sequelize.BOOLEAN,
      },
      quantityNestsRemoved: {
        type: Sequelize.INTEGER,
      },
      quantityEggsRemoved: {
        type: Sequelize.INTEGER,
      },
      eggDestruction: {
        type: Sequelize.BOOLEAN,
      },
      quantityNestsEggsDestroyed: {
        type: Sequelize.INTEGER,
      },
      quantityEggsDestroyed: {
        type: Sequelize.INTEGER,
      },
      chicksToRescueCentre: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksToRescue: {
        type: Sequelize.INTEGER,
      },
      chicksRelocateNearby: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksToRelocate: {
        type: Sequelize.INTEGER,
      },
      killChicks: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksToKill: {
        type: Sequelize.INTEGER,
      },
      killAdults: {
        type: Sequelize.BOOLEAN,
      },
      quantityAdultsToKill: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ReturnActivities');
  },
};
