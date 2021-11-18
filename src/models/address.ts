import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Address model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Address model.
 */
const AddressModel = (sequelize: Sequelize) => {
  class Address extends Model {
    public id!: number;
    public uprn!: string;
    public addressLine1!: string;
    public addressLine2!: string;
    public addressTown!: string;
    public addressCounty!: string;
    public postcode!: string;
  }

  Address.init(
    {
      uprn: {
        type: DataTypes.STRING,
      },
      addressLine1: {
        type: DataTypes.STRING,
      },
      addressLine2: {
        type: DataTypes.STRING,
      },
      addressTown: {
        type: DataTypes.STRING,
      },
      addressCounty: {
        type: DataTypes.STRING,
      },
      postcode: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Address',
      timestamps: true,
      paranoid: true,
    },
  );

  return Address;
};

export {AddressModel as default};
