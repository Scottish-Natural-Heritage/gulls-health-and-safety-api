import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the ReturnActivity.
 */
interface ReturnActivityInterface {
  id?: number;
  removeNests?: boolean;
  quantityNestsRemoved?: number;
  quantityEggsRemoved?: number;
  eggDestruction?: boolean;
  quantityNestsAffected?: number;
  quantityEggsDestroyed?: number;
  chicksToRescueCentre?: boolean;
  quantityChicksToRescue?: number;
  chicksRelocatedNearby?: boolean;
  quantityChicksRelocated?: number;
  killChicks?: boolean;
  quantityChicksKilled?: number;
  killAdults?: boolean;
  quantityAdultsKilled?: number;
}

/**
 * Build an ReturnActivity model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A ReturnActivity model.
 */
const ReturnActivityModel = (sequelize: Sequelize) => {
  class ReturnActivity extends Model {
    public id!: number;
    public removeNests!: boolean;
    public quantityNestsRemoved!: number;
    public quantityEggsRemoved!: number;
    public eggDestruction!: boolean;
    public quantityNestsAffected!: number;
    public quantityEggsDestroyed!: number;
    public chicksToRescueCentre!: boolean;
    public quantityChicksToRescue!: number;
    public chicksRelocatedNearby!: boolean;
    public quantityChicksRelocated!: number;
    public killChicks!: boolean;
    public quantityChicksKilled!: number;
    public killAdults!: boolean;
    public quantityAdultsKilled!: number;
  }

  ReturnActivity.init(
    {
      removeNests: {
        type: DataTypes.BOOLEAN,
      },
      quantityNestsRemoved: {
        type: DataTypes.INTEGER,
      },
      quantityEggsRemoved: {
        type: DataTypes.INTEGER,
      },
      eggDestruction: {
        type: DataTypes.BOOLEAN,
      },
      quantityNestsAffected: {
        type: DataTypes.INTEGER,
      },
      quantityEggsDestroyed: {
        type: DataTypes.INTEGER,
      },
      chicksToRescueCentre: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksToRescue: {
        type: DataTypes.INTEGER,
      },
      chicksRelocatedNearby: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksRelocated: {
        type: DataTypes.INTEGER,
      },
      killChicks: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksKilled: {
        type: DataTypes.INTEGER,
      },
      killAdults: {
        type: DataTypes.BOOLEAN,
      },
      quantityAdultsKilled: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'ReturnActivity',
      timestamps: true,
      paranoid: true,
    },
  );

  return ReturnActivity;
};

export {ReturnActivityModel as default};
export {ReturnActivityInterface};
