import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build a AssessmentMeasure model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Measure model.
 */
const AssessmentMeasureModel = (sequelize: Sequelize) => {
  class AssessmentMeasure extends Model {
    public id!: number;
    public ApplicationId!: number;
    public preventNesting!: string;
    public removeOldNests!: string;
    public removeLitter!: string;
    public humanDisturbance!: string;
    public scaringDevices!: string;
    public hawking!: string;
    public disturbanceByDogs!: string;
  }

  AssessmentMeasure.init(
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
    },
    {
      sequelize,
      modelName: 'AssessmentMeasure',
      timestamps: true,
      paranoid: true,
    },
  );

  return AssessmentMeasure;
};

export {AssessmentMeasureModel as default};
