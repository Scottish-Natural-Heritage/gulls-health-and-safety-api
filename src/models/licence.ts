import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Licence.
 */
interface LicenceInterface {
  ApplicationId?: number;
  periodFrom?: Date;
  periodTo?: Date;
  licenseDetails?: string;
}

/**
 * Build a Licence model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Licence model.
 */
const LicenceModel = (sequelize: Sequelize) => {
  class Licence extends Model {
    public ApplicationId!: number;
    public periodFrom!: Date;
    public periodTo!: Date;
    public licenseDetails!: string;
  }

  Licence.init(
    {
      ApplicationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      periodFrom: {
        type: DataTypes.DATE,
      },
      periodTo: {
        type: DataTypes.DATE,
      },
      licenseDetails: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Licence',
      timestamps: true,
      paranoid: true,
    },
  );

  return Licence;
};

export {LicenceModel as default};
export {LicenceInterface};
