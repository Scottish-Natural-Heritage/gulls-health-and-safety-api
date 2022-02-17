import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build a Permitted Species model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Permitted Species model.
 */
const PSpeciesModel = (sequelize: Sequelize) => {
  class PSpecies extends Model {
    public id!: number;
    public HerringGullId!: number;
    public BlackHeadedGullId!: number;
    public CommonGullId!: number;
    public GreatBlackBackedGullId!: number;
    public LesserBlackBackedGullId!: number;
  }

  PSpecies.init(
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
      modelName: 'PSpecies',
      timestamps: true,
      paranoid: true,
    },
  );

  return PSpecies;
};

export {PSpeciesModel as default};
