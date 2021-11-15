import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build a Measure model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Measure model.
 */
const MeasureModel = (sequelize: Sequelize) => {
  class Measure extends Model {
    public ApplicationId!: number;
    public preventNesting!: string;
    public removeOldNests!: string;
    public removeLitter!: string;
    public humanDisturbance!: string;
    public scaringDevices!: string;
    public hawking!: string;
    public disturbanceByDogs!: string;
    public measuresTriedDetail!: string;
    public measuresWillNotTryDetail!: string;
  }

  Measure.init(
    {
      ApplicationId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      preventNesting: {
        type: DataTypes.STRING,
      },
      removeOldNests: {
        type: DataTypes.STRING,
      },
      removeLitter: {
        type: DataTypes.STRING,
      },
      humanDisturbance: {
        type: DataTypes.STRING,
      },
      scaringDevices: {
        type: DataTypes.STRING,
      },
      hawking: {
        type: DataTypes.STRING,
      },
      disturbanceByDogs: {
        type: DataTypes.STRING,
      },
      measuresTriedDetail: {
        type: DataTypes.STRING,
      },
      measuresWillNotTryDetail: {
        type: DataTypes.STRING,
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
