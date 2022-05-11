/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Amendments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      LicenceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Licenses',
          key: 'ApplicationId',
        },
      },
      SpeciesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ASpecies',
          key: 'id',
        },
      },
      amendReason: {
        type: Sequelize.STRING,
      },
      amendedBy: {
        type: Sequelize.STRING,
      },
      assessment: {
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
    await queryInterface.dropTable('Amendments');
  },
};
