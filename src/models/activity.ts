import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Activity model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Activity model.
 */
const ActivityModel = (sequelize: Sequelize) => {
  class Activity extends Model {
    public removeNests!: boolean;
    public quantityNestsToRemove!: string;
    public eggDestruction!: boolean;
    public quantityNestsWhereEggsDestroyed!: string;
    public chicksToRescueCentre!: boolean;
    public quantityChicksToRescue!: number;
    public chicksRelocateNearby!: boolean;
    public quantityChicksToRelocate!: number;
    public killChicks!: boolean;
    public quantityChicksToKill!: number;
    public killAdults!: boolean;
    public quantityAdultsToKill!: number;
  }

  Activity.init(
    {
      removeNests: {
        type: DataTypes.BOOLEAN,
      },
      quantityNestsToRemove: {
        type: DataTypes.STRING,
      },
      eggDestruction: {
        type: DataTypes.BOOLEAN,
      },
      quantityNestsWhereEggsDestroyed: {
        type: DataTypes.STRING,
      },
      chicksToRescueCentre: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksToRescue: {
        type: DataTypes.INTEGER,
      },
      chicksRelocateNearby: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksToRelocate: {
        type: DataTypes.INTEGER,
      },
      killChicks: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksToKill: {
        type: DataTypes.INTEGER,
      },
      killAdults: {
        type: DataTypes.BOOLEAN,
      },
      quantityAdultsToKill: {
        type: DataTypes.INTEGER,
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
