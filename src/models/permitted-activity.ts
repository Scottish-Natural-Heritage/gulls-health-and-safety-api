import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Permitted Activity model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Permitted Activity model.
 */
const PermittedActivityModel = (sequelize: Sequelize) => {
  class PermittedActivity extends Model {
    public id!: number;
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

  PermittedActivity.init(
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
      modelName: 'PermittedActivity',
      timestamps: true,
      paranoid: true,
    },
  );

  return PermittedActivity;
};

export {PermittedActivityModel as default};
