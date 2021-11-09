'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Measures', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ApplicationId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Applications',
          key: 'id'
        }
      },
      preventNesting: {
        type: Sequelize.STRING
      },
      removeOldNests: {
        type: Sequelize.STRING
      },
      removeLitter: {
        type: Sequelize.STRING
      },
      humanDisturbance: {
        type: Sequelize.STRING
      },
      scaringDevices: {
        type: Sequelize.STRING
      },
      hawking: {
        type: Sequelize.STRING
      },
      disturbanceByDogs: {
        type: Sequelize.STRING
      },
      measuresTriedDetail: {
        type: Sequelize.STRING
      },
      measuresWillNotTryDetail: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Measures');
  }
};
