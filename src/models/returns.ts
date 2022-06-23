import {DataTypes, Model, Sequelize} from 'sequelize';

/**
 * Local interface to hold the Return.
 */
interface ReturnsInterface {
  id?: number;
  LicenceId?: number;
  SpeciesId?: number;
  confirmedReturn?: boolean;
  name?: string;
  returnType?: string;
  siteVisitDate?: string;
  preventMeasure?: boolean;
  preventMeasureDetails?: string;
  compliance?: boolean;
  complianceDetails?: string;
}

/**
 * Build a Returns model.
 *
 * @param {Sequelize.Sequelize} sequelize A Sequelize connection.
 * @returns {Sequelize.Model} A Returns model.
 */
const ReturnsModel = (sequelize: Sequelize) => {
  class Returns extends Model {
    public id!: number;
    public LicenceId!: number;
    public SpeciesId!: number;
    public confirmedReturn!: boolean;
    public name!: string;
    public returnType!: string;
    public siteVisitDate!: string;
    public preventMeasure!: boolean;
    public preventMeasureDetails!: string;
    public compliance!: boolean;
    public complianceDetails!: string;
  }

  Returns.init(
    {
      LicenceId: {
        type: DataTypes.INTEGER,
      },
      SpeciesId: {
        type: DataTypes.INTEGER,
      },
      confirmedReturn: {
        type: DataTypes.BOOLEAN,
      },
      name: {
        type: DataTypes.STRING,
      },
      isReportingReturn: {
        type: DataTypes.BOOLEAN,
      },
      isSiteVisitReturn: {
        type: DataTypes.BOOLEAN,
      },
      isFinalReturn: {
        type: DataTypes.BOOLEAN,
      },
      siteVisitDate: {
        type: DataTypes.DATE,
      },
      hasTriedPreventativeMeasures: {
        type: DataTypes.BOOLEAN,
      },
      preventativeMeasuresDetails: {
        type: DataTypes.TEXT,
      },
      wasCompliant: {
        type: DataTypes.BOOLEAN,
      },
      complianceDetails: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: 'Returns',
      timestamps: true,
      paranoid: true,
    },
  );

  return Returns;
};

export {ReturnsModel as default};
export {ReturnsInterface};
