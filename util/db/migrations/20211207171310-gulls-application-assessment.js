/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Assessments', {
      ApplicationId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Applications',
          key: 'id',
        },
      },
      testOneAssessment: {
        type: Sequelize.STRING,
      },
      testOneDecision: {
        type: Sequelize.BOOLEAN,
      },
      testTwoAssessment: {
        type: Sequelize.STRING,
      },
      testTwoDecision: {
        type: Sequelize.BOOLEAN,
      },
      decision: {
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
    await queryInterface.dropTable('Assessments');
  },
};
