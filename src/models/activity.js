import Sequelize from 'sequelize';

const {Model} = Sequelize;

/**
 * Build an Activity model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Activity model.
 */
const ActivityModel = (sequelize) => {
  class Activity extends Model {}

  Activity.init(
    {
      removeNests: {
        type: Sequelize.BOOLEAN,
      },
      quantityNestsToRemove: {
        type: Sequelize.STRING,
      },
      eggDestruction: {
        type: Sequelize.BOOLEAN,
      },
      quantityNestsWhereEggsDestroyed: {
        type: Sequelize.STRING,
      },
      chicksToRescueCentre: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksToRescue: {
        type: Sequelize.INTEGER,
      },
      chicksRelocateNearby: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksToRelocate: {
        type: Sequelize.INTEGER,
      },
      killChicks: {
        type: Sequelize.BOOLEAN,
      },
      quantityChicksToKill: {
        type: Sequelize.INTEGER,
      },
      killAdults: {
        type: Sequelize.BOOLEAN,
      },
      quantityAdultsToKill: {
        type: Sequelize.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Activity',
      timestamps: true,
      paranoid: true,
    },
  );

  return Activity;
};

export {ActivityModel as default};
