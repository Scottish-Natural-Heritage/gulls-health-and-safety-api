/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Allow our app's user to connect to the database.
    await queryInterface.sequelize.query('grant connect on database licensing to gulls;', {
      type: Sequelize.QueryTypes.RAW,
    });

    // Grant our app's user full control of their own schema.
    await queryInterface.sequelize.query('grant all on schema gulls to gulls;', {
      type: Sequelize.QueryTypes.RAW,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Revoke our app's user's privileges from its schema.
    await queryInterface.sequelize.query('revoke all on schema gulls from gulls;', {
      type: Sequelize.QueryTypes.RAW,
    });

    // Prevent our app's user from connecting to the database.
    await queryInterface.sequelize.query('revoke all on database licensing from gulls;', {
      type: Sequelize.QueryTypes.RAW,
    });
  },
};
