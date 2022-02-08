/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Licenses', {
      ApplicationId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Applications',
          key: 'id',
        },
      },
      periodFrom: {
        type: Sequelize.DATE,
      },
      periodTo: {
        type: Sequelize.DATE,
      },
      licenseDetails: {
        type: Sequelize.STRING,
      },
      PermittedSpeciesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'PermittedSpecies',
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
    await queryInterface.dropTable('Licenses');
  },
};
