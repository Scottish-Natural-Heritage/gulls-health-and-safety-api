import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build a Contact model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Contact model.
 */
const ContactModel = (sequelize: Sequelize) => {
  class Contact extends Model {}

  Contact.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        },
      },
      organisation: {
        type: DataTypes.STRING,
      },
      emailAddress: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Contact',
      timestamps: true,
      paranoid: true,
    },
  );

  return Contact;
};

export {ContactModel as default};
