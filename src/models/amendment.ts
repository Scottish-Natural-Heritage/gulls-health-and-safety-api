import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Amendment.
 */
interface AmendmentInterface {
  id?: number;
  LicenceId?: number;
  SpeciesId?: number;
  amendReason?: string;
  amendedBy?: string;
  assessment?: string;
}

/**
 * Build an Amendment model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Amendment model.
 */
const AmendmentModel = (sequelize: Sequelize) => {
  class Amendment extends Model {
    public id!: number;
    public LicenceId!: number;
    public SpeciesId!: number;
    public amendReason!: string;
    public amendedBy!: string;
    public assessment!: string;
  }

  Amendment.init(
    {
      LicenceId: {
        type: DataTypes.INTEGER,
      },
      SpeciesId: {
        type: DataTypes.INTEGER,
      },
      amendReason: {
        type: DataTypes.STRING,
      },
      amendedBy: {
        type: DataTypes.STRING,
      },
      assessment: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Amendment',
      timestamps: true,
      paranoid: true,
    },
  );

  return Amendment;
};

export {AmendmentModel as default};
export {AmendmentInterface};
