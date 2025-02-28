/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('grant connect on database licensing to rogulls;', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('grant usage on schema gulls to rogulls;', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('grant select on all tables in schema gulls to rogulls;', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('grant gulls to licensing;', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query(
      'alter default privileges for role licensing, gulls in schema gulls grant select on tables to rogulls;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'alter default privileges for role licensing, gulls in schema gulls revoke select on tables to rogulls;',
      {
        type: Sequelize.QueryTypes.RAW,
      },
    );

    await queryInterface.sequelize.query('revoke gulls from licensing;', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('revoke select on schema gulls from rogulls;', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('revoke usage on schema gulls from rogulls;', {
      type: Sequelize.QueryTypes.RAW,
    });

    await queryInterface.sequelize.query('revoke all on database licensing from rogulls;', {
      type: Sequelize.QueryTypes.RAW,
    });
  },
};
