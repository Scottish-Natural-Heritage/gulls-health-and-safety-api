import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the LicenseAdvisory.
 */
interface LicenseAdvisoryInterface {
  LicenseId?: number;
  AdvisoryId?: number;
}

/**
 * Build an LicenseAdvisory model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An LicenseAdvisory model.
 */
const LicenseAdvisoryModel = (sequelize: Sequelize) => {
  class LicenseAdvisory extends Model {
    public LicenseId!: number;
    public AdvisoryId!: string;
  }

  LicenseAdvisory.init(
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
      modelName: 'LicenseAdvisory',
      timestamps: true,
      paranoid: true,
    },
  );

  return LicenseAdvisory;
};

export {LicenseAdvisoryModel as default};
export {LicenseAdvisoryInterface};
