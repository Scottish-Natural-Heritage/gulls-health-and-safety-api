import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build a Permitted Species model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Permitted Species model.
 */
const PermittedSpeciesModel = (sequelize: Sequelize) => {
  class PermittedSpecies extends Model {
    public id!: number;
    public HerringGullId!: number;
    public BlackHeadedGullId!: number;
    public CommonGullId!: number;
    public GreatBlackBackedGullId!: number;
    public LesserBlackBackedGullId!: number;
  }

  PermittedSpecies.init(
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
      modelName: 'PermittedSpecies',
      timestamps: true,
      paranoid: true,
    },
  );

  return PermittedSpecies;
};

export {PermittedSpeciesModel as default};
