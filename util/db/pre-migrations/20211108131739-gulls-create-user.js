/* eslint-disable unicorn/prefer-module */

// Even though this is a 'pre-migrations' migration, we need to import the
// production config as we're setting the password the production account will
// use.
const config = require('../database.js').database;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('create role gulls with noinherit login password :gullsPassword;', {
      type: Sequelize.QueryTypes.RAW,
      replacements: {
        gullsPassword: config.password,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('drop role gulls;', {
      type: Sequelize.QueryTypes.RAW,
    });
  },
};
