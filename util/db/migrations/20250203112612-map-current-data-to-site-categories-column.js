/* eslint-disable unicorn/prefer-module */

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
          UPDATE licensing.gulls."Applications"
          SET "SiteCategoriesId" = CASE
          WHEN "isResidentialSite" = TRUE AND "siteType" = 'privateOwner' THEN 11
          WHEN "isResidentialSite" = TRUE AND "siteType" = 'privateTenant' THEN 12
          WHEN "isResidentialSite" = TRUE AND "siteType" = 'councilTenant' THEN 13
          WHEN "isResidentialSite" = TRUE AND "siteType" = 'shelteredHousing' THEN 5
          WHEN "isResidentialSite" = TRUE AND "siteType" = 'careHome' THEN 5
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'shelteredHousing' THEN 5
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'careHome' THEN 5
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'healthcareProvider' THEN 6
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'office' THEN 18
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'hospitality' THEN 16
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'retail' THEN 18
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'industrial' THEN 17
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'wasteDisposal' THEN 19
          WHEN "isResidentialSite" = FALSE AND "siteType" = 'other' THEN 20
          ELSE "SiteCategoriesId"
          END
          WHERE "SiteCategoriesId" IS NULL;
        `,
        {transaction: t},
      );
    });
  },
  down: async (_queryInterface) => {},
};
