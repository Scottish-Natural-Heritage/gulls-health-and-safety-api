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
      dateNestsEggsRemoved: {
        type: Sequelize.DATE,
      },
      eggDestruction: {
        type: Sequelize.BOOLEAN,
      },
      quantityNestsAffected: {
        type: Sequelize.INTEGER,
      },
      quantityEggsDestroyed: {
        type: Sequelize.INTEGER,
      },
      dateNestsEggsDestroyed: {
        type: Sequelize.DATE,
      },
      chicksToRescueCentre: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksToRescue: {
        type: Sequelize.INTEGER,
      },
      chicksRelocatedNearby: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksRelocated: {
        type: Sequelize.INTEGER,
      },
      killChicks: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksKilled: {
        type: Sequelize.INTEGER,
      },
      killAdults: {
        type: Sequelize.BOOLEAN,
      },
      quantityAdultsKilled: {
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
