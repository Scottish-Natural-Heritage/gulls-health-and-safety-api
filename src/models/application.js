/* eslint-disable unicorn/prevent-abbreviations */
'use strict';

import Sequelize from 'sequelize';

const {Model} = Sequelize;

/**
 * Build an Application model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Application model.
 */
const ApplicationModel = (sequelize) => {
  class Application extends Model {}

  Application.init(
    {
      licenceHolderId: {
        type: Sequelize.STRING
      },
      licenceApplicantId: {
        type: Sequelize.STRING
      },
      licenceHolderAddressId: {
        type: Sequelize.STRING
      },
      siteAddressId: {
        type: Sequelize.STRING
      }
    },
    {
      sequelize,
      modelName: 'Application',
      timestamps: true,
      paranoid: true
    }
  );

  return Application;
};

export {ApplicationModel as default};
