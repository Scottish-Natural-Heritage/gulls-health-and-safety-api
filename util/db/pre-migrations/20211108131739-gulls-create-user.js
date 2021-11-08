'use strict';

// The pre-migrations only make sense when running inside the production docker
// environment. They are not required for the development SQLite DB.
if (process.env.NODE_ENV === 'production') {
  // Even though this is a 'pre-migrations' migration, we need to import the
  // production config as we're setting the password the production account will
  // use.
  const config = require('../../../src/config/database').database;

  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.sequelize.query('create role gulls with noinherit login password :gullsPassword;', {
        type: Sequelize.QueryTypes.RAW,
        replacements: {
          gullsPassword: config.password
        }
      });
    },
    down: async (queryInterface, Sequelize) => {
      await queryInterface.sequelize.query('drop role gulls;', {
        type: Sequelize.QueryTypes.RAW
      });
    }
  };
} else {
  module.exports = {
    up: () => {
      return Promise.resolve();
    },
    down: () => {
      return Promise.resolve();
    }
  };
}
