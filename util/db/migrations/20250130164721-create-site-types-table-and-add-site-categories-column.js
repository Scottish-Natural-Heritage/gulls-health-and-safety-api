/* eslint-disable unicorn/prefer-module */
const databaseConfig = require('../database.js');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'SiteCategories',
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          siteCategory: {
            type: Sequelize.STRING,
          },
          siteType: {
            type: Sequelize.STRING,
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
        },
        {transaction: t},
      );
      await queryInterface.bulkInsert(
        'SiteCategories',
        [
          {
            id: 1,
            siteCategory: 'Healthcare or education',
            siteType: 'Hospital or emergency services',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 2,
            siteCategory: 'Healthcare or education',
            siteType: 'School',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 3,
            siteCategory: 'Healthcare or education',
            siteType: 'Day care/nursery',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 4,
            siteCategory: 'Healthcare or education',
            siteType: 'GP surgery',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 5,
            siteCategory: 'Healthcare or education',
            siteType: 'Care home or sheltered housing',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 6,
            siteCategory: 'Healthcare or education',
            siteType: 'Other',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 7,
            siteCategory: 'National infrastructure',
            siteType: 'Electricity substation',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 8,
            siteCategory: 'National infrastructure',
            siteType: 'Power or gas station',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 9,
            siteCategory: 'National infrastructure',
            siteType: 'Bus or train station',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 10,
            siteCategory: 'National infrastructure',
            siteType: 'Other',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 11,
            siteCategory: 'Residential',
            siteType: 'Private owner/occupier',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 12,
            siteCategory: 'Residential',
            siteType: 'Private tenant',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 13,
            siteCategory: 'Residential',
            siteType: 'Council tenant',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 14,
            siteCategory: 'Residential',
            siteType: 'Other',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 15,
            siteCategory: 'Residential',
            siteType: 'Council tenant',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 16,
            siteCategory: 'Commerical',
            siteType: 'Hospitality',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 17,
            siteCategory: 'Commerical',
            siteType: 'Industrial site',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 18,
            siteCategory: 'Commerical',
            siteType: 'Retail or office building',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 19,
            siteCategory: 'Commerical',
            siteType: 'Waste disposal',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 20,
            siteCategory: 'Commerical',
            siteType: 'Other',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {transaction: t},
      );

      await queryInterface.addColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'SiteCategoriesId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'SiteCategories',
            key: 'id',
          },
        },
        {transaction: t},
      );
    });
  },
  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        {
          schema: databaseConfig.database.schema,
          tableName: 'Applications',
        },
        'SiteCategoriesId',
        {transaction: t},
      );
      await queryInterface.dropTable('SiteCategories', {transaction: t});
    });
  },
};
