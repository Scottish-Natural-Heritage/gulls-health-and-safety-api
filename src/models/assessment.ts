import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Assessment.
 */
interface AssessmentInterface {
  ApplicationId?: number;
  testOneAssessment?: string;
  testOneDecision?: boolean;
  testTwoAssessment?: string;
  testTwoDecision?: boolean;
  decision?: boolean;
}

/**
 * Build an Assessment model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Assessment model.
 */
const AssessmentModel = (sequelize: Sequelize) => {
  class Assessment extends Model {
    public ApplicationId!: number;
    public testOneAssessment!: string;
    public testOneDecision!: boolean;
    public testTwoAssessment!: string;
    public testTwoDecision!: boolean;
    public decision!: boolean;
  }

  Assessment.init(
    {
      ApplicationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          notEmpty: true,
        },
      },
      testOneAssessment: {
        type: DataTypes.STRING,
      },
      testOneDecision: {
        type: DataTypes.BOOLEAN,
      },
      testTwoAssessment: {
        type: DataTypes.STRING,
      },
      testTwoDecision: {
        type: DataTypes.BOOLEAN,
      },
      decision: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: 'Assessment',
      timestamps: true,
      paranoid: true,
    },
  );

  return Assessment;
};

export {AssessmentModel as default};
export {AssessmentInterface};
