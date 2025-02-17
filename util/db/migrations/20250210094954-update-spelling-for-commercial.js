/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      const tableName = process.env.NODE_ENV === 'production' ? 'licensing.gulls."SiteCategories"' : '"SiteCategories"';

      await queryInterface.sequelize.query(
        `
          UPDATE ${tableName}
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
