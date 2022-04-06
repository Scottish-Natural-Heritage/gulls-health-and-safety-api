/* eslint-disable unicorn/prefer-module */

const config = require('../database.js').ssDatabase;

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      return queryInterface.sequelize.query('ALTER ROLE rogulls WITH PASSWORD :roGullsPassword;', {
        type: Sequelize.QueryTypes.RAW,
        replacements: {
          roGullsPassword: config.password,
        },
      });
    },

    down: async (queryInterface, Sequelize) => {
      return queryInterface.sequelize.query("ALTER ROLE rogulls WITH PASSWORD 'override_this_value';", {
        type: Sequelize.QueryTypes.RAW,
      });
    },
  };
} else {
  module.exports = {
    up: () => {
      return Promise.resolve();
    },
    down: () => {
      return Promise.resolve();
    },
  };
}
