/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Measures', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      ApplicationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Applications',
          key: 'id',
        },
      },
      preventNesting: {
        type: Sequelize.STRING,
      },
      removeOldNests: {
        type: Sequelize.STRING,
      },
      removeLitter: {
        type: Sequelize.STRING,
      },
      humanDisturbance: {
        type: Sequelize.STRING,
      },
      scaringDevices: {
        type: Sequelize.STRING,
      },
      hawking: {
        type: Sequelize.STRING,
      },
      disturbanceByDogs: {
        type: Sequelize.STRING,
      },
      measuresTriedDetail: {
        type: Sequelize.STRING,
      },
      measuresWillNotTryDetail: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Measures');
  },
};
