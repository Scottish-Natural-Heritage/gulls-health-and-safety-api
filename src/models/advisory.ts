import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Advisory Notes.
 */
interface AdvisoryInterface {
  Id?: number;
  advisory?: string;
  orderNumber?: number;
  default?: boolean;
}

/**
 * Build an Advisory model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Advisory model.
 */
const AdvisoryModel = (sequelize: Sequelize) => {
  class Advisory extends Model {
    public Id!: number;
    public advisory!: string;
    public orderNumber!: number;
    public default!: boolean;
  }

  Advisory.init(
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      advisory: {
        type: DataTypes.STRING,
      },
      orderNumber: {
        type: DataTypes.INTEGER,
      },
      default: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Advisory',
      timestamps: true,
      paranoid: true,
    },
  );

  return Advisory;
};

export {AdvisoryModel as default};
export {AdvisoryInterface};
