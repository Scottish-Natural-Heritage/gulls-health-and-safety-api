import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Amended Advisory.
 */
interface AmendAdvisoryInterface {
  AmendmentId?: number;
  AdvisoryId?: number;
}

/**
 * Build an Amended Advisory model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Amended Advisory model.
 */
const AmendAdvisoryModel = (sequelize: Sequelize) => {
  class AmendAdvisory extends Model {
    public AmendmentId!: number;
    public AdvisoryId!: string;
  }

  AmendAdvisory.init(
    {
      AmendmentId: {
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
      modelName: 'AmendAdvisory',
      timestamps: true,
      paranoid: true,
    },
  );

  return AmendAdvisory;
};

export {AmendAdvisoryModel as default};
export {AmendAdvisoryInterface};
