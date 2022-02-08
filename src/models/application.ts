import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Build an Application model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} An Application model.
 */
const ApplicationModel = (sequelize: Sequelize) => {
  class Application extends Model {
    public id!: number;
    public LicenceHolderId!: number;
    public LicenceApplicantId!: number;
    public LicenceHolderAddressId!: number;
    public SiteAddressId!: number;
    public SpeciesId!: number;
    public PermittedSpeciesId!: number;
    public isResidentialSite!: boolean;
    public siteType!: string;
    public previousLicence!: boolean;
    public previousLicenceNumber!: string;
    public supportingInformation!: string;
    public confirmedByLicenseHolder!: boolean;
    public staffNumber!: string;
  }

  Application.init(
    {
      LicenceHolderId: {
        type: DataTypes.INTEGER,
      },
      LicenceApplicantId: {
        type: DataTypes.INTEGER,
      },
      LicenceHolderAddressId: {
        type: DataTypes.INTEGER,
      },
      SiteAddressId: {
        type: DataTypes.INTEGER,
      },
      SpeciesId: {
        type: DataTypes.INTEGER,
      },
      PermittedSpeciesId: {
        type: DataTypes.INTEGER,
      },
      isResidentialSite: {
        type: DataTypes.BOOLEAN,
      },
      siteType: {
        type: DataTypes.STRING,
      },
      previousLicence: {
        type: DataTypes.BOOLEAN,
      },
      previousLicenceNumber: {
        type: DataTypes.STRING,
      },
      supportingInformation: {
        type: DataTypes.STRING,
      },
      confirmedByLicenseHolder: {
        type: DataTypes.BOOLEAN,
      },
      staffNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Application',
      timestamps: true,
      paranoid: true,
    },
  );

  return Application;
};

export {ApplicationModel as default};
