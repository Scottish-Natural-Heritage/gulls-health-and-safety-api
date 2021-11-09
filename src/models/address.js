'use strict';

import Sequelize from 'sequelize';

const {Model} = Sequelize;

/**
 * Build an Address model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Address model.
 */
const AddressModel = (sequelize) => {
  class Address extends Model {}

  Address.init(
    {
      uprn: {
        type: Sequelize.STRING,
      },
      addressLine1: {
        type: Sequelize.STRING
      },
      addressLine2: {
        type: Sequelize.STRING,
      },
      addressTown: {
        type: Sequelize.STRING
      },
      addressCounty: {
        type: Sequelize.STRING
      },
      postcode: {
        type: Sequelize.STRING
      }
    },
    {
      sequelize,
      modelName: 'Address',
      timestamps: true,
      paranoid: true
    }
  );

  return Address;
};

export {AddressModel as default};
