'use strict';

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
      herringGullId: {
        type: Sequelize.INTEGER
      },
      blackHeadedGullId: {
        type: Sequelize.INTEGER
      },
      commonGullId: {
        type: Sequelize.INTEGER
      },
      greatBlackBackedGullId: {
        type: Sequelize.INTEGER
      },
      lesserBlackBackedGullId: {
        type: Sequelize.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'Species',
      timestamps: true,
      paranoid: true
    }
  );

  return Species;
};

export {SpeciesModel as default};
