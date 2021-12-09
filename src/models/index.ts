/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports, unicorn/prefer-module, new-cap */

import {productionDatabaseConfig, localDatabaseConfig} from '../config/ts-database-config';
import Application from './application';
import Assessment from './assessment';
import Contact from './contact';
import Address from './address';
import Issue from './issue';
import Measure from './measure';
import Species from './species';
import Activity from './activity';

const Sequelize = require('sequelize');

// Default to the local database configuration.
let sequelize = new Sequelize(localDatabaseConfig.database);

// If we're running in production, switch to that configuration instead.
if (process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize(productionDatabaseConfig.database);
}

const database = {
  sequelize,
  Application: Application(sequelize),
  Assessment: Assessment(sequelize),
  Contact: Contact(sequelize),
  Address: Address(sequelize),
  Issue: Issue(sequelize),
  Measure: Measure(sequelize),
  Species: Species(sequelize),
  Activity: Activity(sequelize),
};

// Relationships go here.
database.Application.belongsTo(database.Contact, {as: 'LicenceHolder', foreignKey: 'LicenceHolderId'});
database.Application.belongsTo(database.Contact, {as: 'LicenceApplicant', foreignKey: 'LicenceApplicantId'});
database.Application.belongsTo(database.Address, {as: 'LicenceHolderAddress', foreignKey: 'LicenceHolderAddressId'});
database.Application.belongsTo(database.Address, {as: 'SiteAddress', foreignKey: 'SiteAddressId'});
database.Application.belongsTo(database.Species, {as: 'Species', foreignKey: 'SpeciesId'});

database.Contact.hasOne(database.Application, {as: 'LicenceHolder', foreignKey: 'LicenceHolderId'});
database.Contact.hasOne(database.Application, {as: 'LicenceApplicant', foreignKey: 'LicenceApplicantId'});
database.Address.hasOne(database.Application, {as: 'LicenceHolderAddress', foreignKey: 'LicenceHolderAddressId'});
database.Address.hasOne(database.Application, {as: 'SiteAddress', foreignKey: 'SiteAddressId'});
database.Species.hasOne(database.Application, {as: 'Species', foreignKey: 'SpeciesId'});

database.Assessment.belongsTo(database.Application, {as: 'ApplicationAssessment', foreignKey: 'ApplicationId'});
database.Issue.belongsTo(database.Application, {as: 'ApplicationIssue', foreignKey: 'ApplicationId'});
database.Measure.belongsTo(database.Application, {as: 'ApplicationMeasure', foreignKey: 'ApplicationId'});

database.Application.hasOne(database.Assessment, {as: 'ApplicationAssessment', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Issue, {as: 'ApplicationIssue', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Measure, {as: 'ApplicationMeasure', foreignKey: 'ApplicationId'});

database.Species.belongsTo(database.Activity, {as: 'HerringGull', foreignKey: 'HerringGullId'});
database.Species.belongsTo(database.Activity, {as: 'BlackHeadedGull', foreignKey: 'BlackHeadedGullId'});
database.Species.belongsTo(database.Activity, {as: 'CommonGull', foreignKey: 'CommonGullId'});
database.Species.belongsTo(database.Activity, {as: 'GreatBlackBackedGull', foreignKey: 'GreatBlackBackedGullId'});
database.Species.belongsTo(database.Activity, {as: 'LesserBlackBackedGull', foreignKey: 'LesserBlackBackedGullId'});

database.Activity.hasOne(database.Species, {as: 'HerringGull', foreignKey: 'HerringGullId'});
database.Activity.hasOne(database.Species, {as: 'BlackHeadedGull', foreignKey: 'BlackHeadedGullId'});
database.Activity.hasOne(database.Species, {as: 'CommonGull', foreignKey: 'CommonGullId'});
database.Activity.hasOne(database.Species, {as: 'GreatBlackBackedGull', foreignKey: 'GreatBlackBackedGullId'});
database.Activity.hasOne(database.Species, {as: 'LesserBlackBackedGull', foreignKey: 'LesserBlackBackedGullId'});

export {database as default};
