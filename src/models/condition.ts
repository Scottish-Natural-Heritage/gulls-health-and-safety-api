import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Condition.
 */
interface ConditionInterface {
  id?: number;
  condition?: string;
  orderNumber?: number;
  default?: boolean;
  category?: string;
}

/**
 * Build an Condition model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Condition model.
 */
const ConditionModel = (sequelize: Sequelize) => {
  class Condition extends Model {
    public id!: number;
    public condition!: string;
    public orderNumber!: number;
    public default!: boolean;
    public category!: string;
  }

  Condition.init(
    {
      condition: {
        type: DataTypes.STRING,
      },
      orderNumber: {
        type: DataTypes.INTEGER,
      },
      default: {
        type: DataTypes.BOOLEAN,
      },
      category: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Condition',
      timestamps: true,
      paranoid: true,
    },
  );

  return Condition;
};

export {ConditionModel as default};
export {ConditionInterface};
