import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Amended Species.
 */
interface ASpeciesInterface {
  id?: number;
  HerringGullId?: number;
  BlackHeadedGullId?: number;
  CommonGullId?: number;
  GreatBlackBackedGullId?: number;
  LesserBlackBackedGullId?: number;
}

/**
 * Build an Amended Species model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Amended Species model.
 */
const ASpeciesModel = (sequelize: Sequelize) => {
  class ASpecies extends Model {
    public id!: number;
    public HerringGullId!: number;
    public BlackHeadedGullId!: number;
    public CommonGullId!: number;
    public GreatBlackBackedGullId!: number;
    public LesserBlackBackedGullId!: number;
  }

  ASpecies.init(
    {
      HerringGullId: {
        type: DataTypes.INTEGER,
      },
      BlackHeadedGullId: {
        type: DataTypes.INTEGER,
      },
      CommonGullId: {
        type: DataTypes.INTEGER,
      },
      GreatBlackBackedGullId: {
        type: DataTypes.INTEGER,
      },
      LesserBlackBackedGullId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'ASpecies',
      timestamps: true,
      paranoid: true,
    },
  );

  return ASpecies;
};

export {ASpeciesModel as default};
export {ASpeciesInterface};
