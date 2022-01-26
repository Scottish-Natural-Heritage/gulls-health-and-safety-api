import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Revocation model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Revocation model.
 */
const WithdrawalModel = (sequelize: Sequelize) => {
  class Withdrawal extends Model {
    public id!: number;
    public ApplicationId!: number;
    public createdBy!: string;
    public reason!: string;
  }

  Withdrawal.init(
    {
      ApplicationId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      createdBy: {
        type: DataTypes.STRING,
      },
      reason: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Withdrawal',
      timestamps: true,
      paranoid: true,
    },
  );

  return Withdrawal;
};

export {WithdrawalModel as default};
