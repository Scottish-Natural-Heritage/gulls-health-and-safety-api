/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AmendConditions', {
      AmendmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Amendments',
          key: 'id',
        },
      },
      ConditionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Conditions',
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
    await queryInterface.dropTable('AmendConditions');
  },
};
