'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Species', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      herringGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id'
        }
      },
      blackHeadedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id'
        }
      },
      commonGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id'
        }
      },
      greatBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id'
        }
      },
      lesserBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Activities',
          key: 'id'
        }
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Species');
  }
};
