/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Returns', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      LicenceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Licence',
          key: 'ApplicationId',
        },
      },
      SpeciesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ReturnSpecies',
          key: 'id',
        },
      },
      confirmedReturn: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Returns');
  },
};
