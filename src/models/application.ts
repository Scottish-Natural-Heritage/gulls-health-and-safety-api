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
    public SiteCategoriesId!: number;
    public previousLicence!: boolean;
    public previousLicenceNumber!: string;
    public supportingInformation!: string;
    public confirmedByLicenseHolder!: boolean;
    public staffNumber!: string;
    public fourteenDayReminder!: boolean;
    public confirmedAt!: Date;
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
      SiteCategoriesId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'SiteCategories',
          key: 'id',
        },
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
      fourteenDayReminder: {
        type: DataTypes.BOOLEAN,
      },
      confirmedAt: {
        type: DataTypes.DATE,
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
