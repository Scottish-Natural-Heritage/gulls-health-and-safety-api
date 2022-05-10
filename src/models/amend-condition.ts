import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Amended Condition.
 */
interface AmendConditionInterface {
  AmendmentId?: number;
  ConditionId?: number;
}

/**
 * Build an Amended Condition model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Amended Condition model.
 */
const AmendConditionModel = (sequelize: Sequelize) => {
  class AmendCondition extends Model {
    public AmendmentId!: number;
    public ConditionId!: string;
  }

  AmendCondition.init(
    {
      AmendmentId: {
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
      modelName: 'AmendCondition',
      timestamps: true,
      paranoid: true,
    },
  );

  return AmendCondition;
};

export {AmendConditionModel as default};
export {AmendConditionInterface};
