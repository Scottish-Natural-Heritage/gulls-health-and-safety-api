import { Model, Sequelize} from 'sequelize';

/**
 * Build a Species model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Species model.
 */
const SpeciesModel = (sequelize: Sequelize) => {
  class Species extends Model {
    public HerringGullId!: number;
    public BlackHeadedGullId!: number;
    public CommonGullId!: number;
    public GreatBlackBackedGullId!: number;
    public LesserBlackBackedGullId!: number;
  }

  Species.init(
    {

    },
    {
      sequelize,
      modelName: 'Species',
      timestamps: false,
      paranoid: true,
    },
  );

  return Species;
};

export {SpeciesModel as default};
