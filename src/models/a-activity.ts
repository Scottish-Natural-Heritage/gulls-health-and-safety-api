import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the AActivityInterface.
 */
interface AActivityInterface {
  id?: number;
  removeNests?: boolean;
  quantityNestsToRemove?: string;
  eggDestruction?: boolean;
  quantityNestsWhereEggsDestroyed?: string;
  chicksToRescueCentre?: boolean;
  quantityChicksToRescue?: number;
  chicksRelocateNearby?: boolean;
  quantityChicksToRelocate?: number;
  killChicks?: boolean;
  quantityChicksToKill?: number;
  killAdults?: boolean;
  quantityAdultsToKill?: number;
}

/**
 * Build an Amended Activity model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Amended Activity model.
 */
const AActivityModel = (sequelize: Sequelize) => {
  class AActivity extends Model {
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

  AActivity.init(
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
      modelName: 'AActivity',
      timestamps: true,
      paranoid: true,
    },
  );

  return AActivity;
};

export {AActivityModel as default};
export {AActivityInterface};
