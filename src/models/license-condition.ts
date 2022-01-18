import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the LicenseCondition.
 */
interface LicenseConditionInterface {
  LicenseId?: number;
  ConditionId?: number;
}

/**
 * Build an LicenseCondition model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An LicenseCondition model.
 */
const LicenseConditionModel = (sequelize: Sequelize) => {
  class LicenseCondition extends Model {
    public LicenseId!: number;
    public ConditionId!: string;
  }

  LicenseCondition.init(
    {
      LicenseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      ConditionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'LicenseCondition',
      timestamps: true,
      paranoid: true,
    },
  );

  return LicenseCondition;
};

export {LicenseConditionModel as default};
export {LicenseConditionInterface};
