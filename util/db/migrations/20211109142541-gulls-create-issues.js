'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Issues', {
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
      aggression: {
        type: Sequelize.BOOLEAN
      },
      diveBombing: {
        type: Sequelize.BOOLEAN
      },
      noise: {
        type: Sequelize.BOOLEAN
      },
      droppings: {
        type: Sequelize.BOOLEAN
      },
      nestingMaterial: {
        type: Sequelize.BOOLEAN
      },
      atHeightAggression: {
        type: Sequelize.BOOLEAN
      },
      other: {
        type: Sequelize.BOOLEAN
      },
      whenIssue: {
        type: Sequelize.STRING
      },
      whoAffected: {
        type: Sequelize.STRING
      },
      howAffected: {
        type: Sequelize.STRING
      },
      otherIssueInformation: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Issues');
  }
};