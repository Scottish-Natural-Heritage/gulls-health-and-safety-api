import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the License.
 */
interface LicenseInterface {
  ApplicationId?: number;
  periodFrom?: Date;
  periodTo?: Date;
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
