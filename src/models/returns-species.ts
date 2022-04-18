import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the ReturnSpecies.
 */
interface ReturnSpeciesInterface {
  id?: number;
  HerringGullId?: number;
  BlackHeadedGullId?: number;
  CommonGullId?: number;
  GreatBlackBackedGullId?: number;
  LesserBlackBackedGullId?: number;
}

/**
 * Build a ReturnSpecies model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A ReturnSpecies model.
 */
const ReturnSpeciesModel = (sequelize: Sequelize) => {
  class ReturnSpecies extends Model {
    public id!: number;
    public HerringGullId!: number;
    public BlackHeadedGullId!: number;
    public CommonGullId!: number;
    public GreatBlackBackedGullId!: number;
    public LesserBlackBackedGullId!: number;
  }

  ReturnSpecies.init(
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
      modelName: 'ReturnSpecies',
      timestamps: true,
      paranoid: true,
    },
  );

  return ReturnSpecies;
};

export {ReturnSpeciesModel as default};
export {ReturnSpeciesInterface}
