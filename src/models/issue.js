'use strict';

import Sequelize from 'sequelize';

const {Model} = Sequelize;

/**
 * Build an Issue model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Issue model.
 */
const IssueModel = (sequelize) => {
  class Issue extends Model {}

  Issue.init(
    {
      ApplicationId: {
        type: Sequelize.INTEGER,
        validate: {
          notEmpty: true
        }
      },
      aggression: {
        type: Sequelize.BOOLEAN
      },
      diveBombing: {
        type: Sequelize.BOOLEAN
      },
      noise: {
        type: Sequelize.BOOLEAN
      },
      droppings: {
        type: Sequelize.BOOLEAN
      },
      nestingMaterial: {
        type: Sequelize.BOOLEAN
      },
      atHeightAggression: {
        type: Sequelize.BOOLEAN
      },
      other: {
        type: Sequelize.BOOLEAN
      },
      whenIssue: {
        type: Sequelize.STRING
      },
      whoAffected: {
        type: Sequelize.STRING
      },
      howAffected: {
        type: Sequelize.STRING
      },
      otherIssueInformation: {
        type: Sequelize.STRING
      }
    },
    {
      sequelize,
      modelName: 'Issue',
      timestamps: true,
      paranoid: true
    }
  );

  return Issue;
};

export {IssueModel as default};
