import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Issue model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Issue model.
 */
const IssueModel = (sequelize: Sequelize) => {
  class Issue extends Model {}

  Issue.init(
    {
      ApplicationId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: true,
        },
      },
      aggression: {
        type: DataTypes.BOOLEAN,
      },
      diveBombing: {
        type: DataTypes.BOOLEAN,
      },
      noise: {
        type: DataTypes.BOOLEAN,
      },
      droppings: {
        type: DataTypes.BOOLEAN,
      },
      nestingMaterial: {
        type: DataTypes.BOOLEAN,
      },
      atHeightAggression: {
        type: DataTypes.BOOLEAN,
      },
      other: {
        type: DataTypes.BOOLEAN,
      },
      whenIssue: {
        type: DataTypes.STRING,
      },
      whoAffected: {
        type: DataTypes.STRING,
      },
      howAffected: {
        type: DataTypes.STRING,
      },
      otherIssueInformation: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Issue',
      timestamps: true,
      paranoid: true,
    },
  );

  return Issue;
};

export {IssueModel as default};
