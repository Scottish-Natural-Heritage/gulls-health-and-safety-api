import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the LicensedCondition.
 */
interface LicensedConditionInterface {
  LicenseId?: number;
  ConditionId?: number;
}

/**
 * Build an LicensedCondition model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An LicensedCondition model.
 */
const LicensedConditionModel = (sequelize: Sequelize) => {
  class LicensedCondition extends Model {
    public LicenseId!: number;
    public ConditionId!: string;
  }

  LicensedCondition.init(
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
      modelName: 'LicensedCondition',
      timestamps: true,
      paranoid: true,
    },
  );

  return LicensedCondition;
};

export {LicensedConditionModel as default};
export {LicensedConditionInterface};
