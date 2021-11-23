import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Issue model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Issue model.
 */
const IssueModel = (sequelize: Sequelize) => {
  class Issue extends Model {
    public id!: number;
    public ApplicationId!: number;
    public aggression!: boolean;
    public diveBombing!: boolean;
    public noise!: boolean;
    public droppings!: boolean;
    public nestingMaterial!: boolean;
    public atHeightAggression!: boolean;
    public other!: boolean;
    public whenIssue!: string;
    public whoAffected!: string;
    public howAffected!: string;
    public otherIssueInformation!: string;
  }

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
