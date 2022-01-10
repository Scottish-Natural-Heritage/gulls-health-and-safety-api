/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PermittedSpecies', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      HerringGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PermittedActivities',
          key: 'id',
        },
      },
      BlackHeadedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PermittedActivities',
          key: 'id',
        },
      },
      CommonGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PermittedActivities',
          key: 'id',
        },
      },
      GreatBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PermittedActivities',
          key: 'id',
        },
      },
      LesserBlackBackedGullId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PermittedActivities',
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
    await queryInterface.dropTable('PermittedSpecies');
  },
};
