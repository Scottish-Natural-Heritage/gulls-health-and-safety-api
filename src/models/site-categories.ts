import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build a Species model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Species model.
 */
const SiteCategoriesModel = (sequelize: Sequelize) => {
  class SiteCategories extends Model {
    public id!: number;
    public siteCategory!: string;
    public siteType!: string;
  }

  SiteCategories.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      siteCategory: {
        type: DataTypes.STRING,
      },
      siteType: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'SiteCategories',
      timestamps: true,
      paranoid: true,
    },
  );

  return SiteCategories;
};

export {SiteCategoriesModel as default};
