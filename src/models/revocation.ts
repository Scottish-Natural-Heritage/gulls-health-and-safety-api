import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Revocation model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Revocation model.
 */
const RevocationModel = (sequelize: Sequelize) => {
  class Revocation extends Model {
    public id!: number;
    public ApplicationId!: number;
    public createdBy!: string;
    public reason!: string;
  }

  Revocation.init(
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
      modelName: 'Revocation',
      timestamps: true,
      paranoid: true,
    },
  );

  return Revocation;
};

export {RevocationModel as default};
