import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the LicensedAdvisory.
 */
interface LicensedAdvisoryInterface {
  LicenseId?: number;
  AdvisoryId?: number;
}

/**
 * Build an LicensedAdvisory model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An LicensedAdvisory model.
 */
const LicensedAdvisoryModel = (sequelize: Sequelize) => {
  class LicensedAdvisory extends Model {
    public LicenseId!: number;
    public AdvisoryId!: string;
  }

  LicensedAdvisory.init(
    {
      LicenseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      AdvisoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'LicensedAdvisory',
      timestamps: true,
      paranoid: true,
    },
  );

  return LicensedAdvisory;
};

export {LicensedAdvisoryModel as default};
export {LicensedAdvisoryInterface};
