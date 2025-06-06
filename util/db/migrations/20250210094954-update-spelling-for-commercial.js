/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
          UPDATE licensing.gulls."SiteCategories"
          SET "siteCategory" = CASE
          WHEN "siteCategory" = 'Commerical' THEN 'Commercial'
          END
          WHERE "siteCategory" = 'Commerical';
        `,
        {transaction: t},
      );
    });
  },
  down: async (_queryInterface, _Sequelize) => {},
};
