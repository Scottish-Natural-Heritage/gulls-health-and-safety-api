/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PermittedActivities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      removeNests: {
        type: Sequelize.BOOLEAN,
      },
      quantityNestsToRemove: {
        type: Sequelize.STRING,
      },
      eggDestruction: {
        type: Sequelize.BOOLEAN,
      },
      quantityNestsWhereEggsDestroyed: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('PermittedActivities');
  },
};
