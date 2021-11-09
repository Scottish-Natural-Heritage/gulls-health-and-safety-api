'use strict';

import Sequelize from 'sequelize';

const {Model} = Sequelize;

/**
 * Build a Contact model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Contact model.
 */
const ContactModel = (sequelize) => {
  class Contact extends Model {}

  Contact.init(
    {
      name: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      organisation: {
        type: Sequelize.STRING
      },
      emailAddress: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      phoneNumber: {
        type: Sequelize.STRING
      }
    },
    {
      sequelize,
      modelName: 'Contact',
      timestamps: true,
      paranoid: true
    }
  );

  return Contact;
};

export {ContactModel as default};
