import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the License.
 */
interface LicenseInterface {
  ApplicationId?: number;
  periodFrom?: Date;
  periodTo?: Date;
  createdBy?: string;
}

/**
 * Build a License model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An License model.
 */
const LicenseModel = (sequelize: Sequelize) => {
  class License extends Model {
    public ApplicationId!: number;
    public periodFrom!: Date;
    public periodTo!: Date;
    public createdBy!: string;
  }

  License.init(
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
      createdBy: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'License',
      timestamps: true,
      paranoid: true,
    },
  );

  return License;
};

export {LicenseModel as default};
export {LicenseInterface};
