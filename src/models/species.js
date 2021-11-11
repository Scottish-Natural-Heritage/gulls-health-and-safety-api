import Sequelize from 'sequelize';

const {Model} = Sequelize;

/**
 * Build a Species model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Species model.
 */
const SpeciesModel = (sequelize) => {
  class Species extends Model {}

  Species.init(
    {
      HerringGullId: {
        type: Sequelize.INTEGER,
      },
      BlackHeadedGullId: {
        type: Sequelize.INTEGER,
      },
      CommonGullId: {
        type: Sequelize.INTEGER,
      },
      GreatBlackBackedGullId: {
        type: Sequelize.INTEGER,
      },
      LesserBlackBackedGullId: {
        type: Sequelize.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Species',
      timestamps: true,
      paranoid: true,
    },
  );

  return Species;
};

export {SpeciesModel as default};
