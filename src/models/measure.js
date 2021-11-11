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
          notEmpty: true,
        },
      },
      preventNesting: {
        type: Sequelize.STRING,
      },
      removeOldNests: {
        type: Sequelize.STRING,
      },
      removeLitter: {
        type: Sequelize.STRING,
      },
      humanDisturbance: {
        type: Sequelize.STRING,
      },
      scaringDevices: {
        type: Sequelize.STRING,
      },
      hawking: {
        type: Sequelize.STRING,
      },
      disturbanceByDogs: {
        type: Sequelize.STRING,
      },
      measuresTriedDetail: {
        type: Sequelize.STRING,
      },
      measuresWillNotTryDetail: {
        type: Sequelize.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Measure',
      timestamps: true,
      paranoid: true,
    },
  );

  return Measure;
};

export {MeasureModel as default};
