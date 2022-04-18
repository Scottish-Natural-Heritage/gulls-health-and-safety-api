import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Return.
 */
interface ReturnsInterface {
  id?: number;
  LicenceId?: number;
  SpeciesId?: number;
  confirmedReturn?: boolean;
}

/**
 * Build a Returns model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Returns model.
 */
const ReturnsModel = (sequelize: Sequelize) => {
  class Returns extends Model {
    public id!: number;
    public LicenceId!: number;
    public SpeciesId!: number;
    public confirmedReturn!: boolean;
  }

  Returns.init(
    {
      LicenceId: {
        type: DataTypes.INTEGER,
      },
      SpeciesId: {
        type: DataTypes.INTEGER,
      },
      confirmedByLicenseHolder: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Returns',
      timestamps: true,
      paranoid: true,
    },
  );

  return Returns;
};

export {ReturnsModel as default};
export {ReturnsInterface};
