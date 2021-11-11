module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Activities', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Activities');
  },
};
