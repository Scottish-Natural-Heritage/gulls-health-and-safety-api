/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ASpecies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      HerringGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AActivities',
          key: 'id',
        },
      },
      BlackHeadedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AActivities',
          key: 'id',
        },
      },
      CommonGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AActivities',
          key: 'id',
        },
      },
      GreatBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AActivities',
          key: 'id',
        },
      },
      LesserBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'AActivities',
          key: 'id',
        },
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
    await queryInterface.dropTable('ASpecies');
  },
};
