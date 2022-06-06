import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the ReturnActivity.
 */
interface RActivityInterface {
  id?: number;
  removeNests?: boolean;
  quantityNestsRemoved?: number;
  quantityEggsRemoved?: number;
  dateNestsEggsRemoved?: Date;
  eggDestruction?: boolean;
  quantityNestsAffected?: number;
  quantityEggsDestroyed?: number;
  dateNestsEggsDestroyed?: Date;
  chicksToRescueCentre?: boolean;
  quantityChicksToRescue?: number;
  dateChicksToRescue?: Date;
  chicksRelocatedNearby?: boolean;
  quantityChicksRelocated?: number;
  dateChicksRelocated?: Date;
  killChicks?: boolean;
  quantityChicksKilled?: number;
  dateChicksKilled?: Date;
  killAdults?: boolean;
  quantityAdultsKilled?: number;
  dateAdultsKilled?: Date;
  wildlifeCentre?: string;
}

/**
 * Build an ReturnActivity model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A ReturnActivity model.
 */
const RActivityModel = (sequelize: Sequelize) => {
  class RActivity extends Model {
    public id!: number;
    public removeNests!: boolean;
    public quantityNestsRemoved!: number;
    public quantityEggsRemoved!: number;
    public dateNestsEggsRemoved!: Date;
    public eggDestruction!: boolean;
    public quantityNestsAffected!: number;
    public quantityEggsDestroyed!: number;
    public dateNestsEggsDestroyed!: Date;
    public chicksToRescueCentre!: boolean;
    public quantityChicksToRescue!: number;
    public dateChicksToRescue!: Date;
    public chicksRelocatedNearby!: boolean;
    public quantityChicksRelocated!: number;
    public dateChicksRelocated!: Date;
    public killChicks!: boolean;
    public quantityChicksKilled!: number;
    public dateChicksKilled!: Date;
    public killAdults!: boolean;
    public quantityAdultsKilled!: number;
    public dateAdultsKilled!: Date;
    public wildlifeCentre!: string;
  }

  RActivity.init(
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
      dateNestsEggsRemoved: {
        type: DataTypes.DATE,
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
      dateNestsEggsDestroyed: {
        type: DataTypes.DATE,
      },
      chicksToRescueCentre: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksToRescue: {
        type: DataTypes.INTEGER,
      },
      dateChicksToRescue: {
        type: DataTypes.DATE,
      },
      chicksRelocatedNearby: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksRelocated: {
        type: DataTypes.INTEGER,
      },
      dateChicksRelocated: {
        type: DataTypes.DATE,
      },
      killChicks: {
        type: DataTypes.BOOLEAN,
      },
      quantityChicksKilled: {
        type: DataTypes.INTEGER,
      },
      dateChicksKilled: {
        type: DataTypes.DATE,
      },
      killAdults: {
        type: DataTypes.BOOLEAN,
      },
      quantityAdultsKilled: {
        type: DataTypes.INTEGER,
      },
      dateAdultsKilled: {
        type: DataTypes.DATE,
      },
      wildlifeCentre: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'RActivity',
      timestamps: true,
      paranoid: true,
    },
  );

  return RActivity;
};

export {RActivityModel as default};
export {RActivityInterface};
