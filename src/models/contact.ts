import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the ContactInterface.
 */
interface ContactInterface {
  id?: number;
  name?: string;
  organisation?: string;
  emailAddress?: string;
  phoneNumber?: string;
}

/**
 * Build a Contact model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Contact model.
 */
const ContactModel = (sequelize: Sequelize) => {
  class Contact extends Model {
    public id!: number;
    public name!: string;
    public organisation!: string;
    public emailAddress!: string;
    public phoneNumber!: string;
  }

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
export {ContactInterface};
