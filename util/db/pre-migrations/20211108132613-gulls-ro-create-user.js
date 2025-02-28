/* eslint-disable unicorn/prefer-module */

// Even though this is a 'pre-migrations' migration, we need to import the
// production config as we're setting the password the production account will
// use.
const config = require('../database.js').ssDatabase;

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('create role rogulls with noinherit login password :roGullsPassword;', {
      type: Sequelize.QueryTypes.RAW,
      replacements: {
        roGullsPassword: config.password,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('drop role rogulls;', {
      type: Sequelize.QueryTypes.RAW,
    });
  },
};
