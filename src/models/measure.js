'use strict';

import Sequelize from 'sequelize';

const {Model} = Sequelize;

/**
 * Build a Measure model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Measure model.
 */
const MeasureModel = (sequelize) => {
  class Measure extends Model {}

  Measure.init(
    {
      ApplicationId: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true
        }
      },

    },
    {
      sequelize,
      modelName: 'Measure',
      timestamps: true,
      paranoid: true
    }
  );

  return Measure;
};

export {MeasureModel as default};
