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
import PermittedSpecies from './permitted-species';
import PermittedActivity from './permitted-activity';
import License from './license';
import LicenseAdvisory from './license-advisory';
import LicenseCondition from './license-condition';
import Advisory from './advisory';
import Condition from './condition';
import Note from './note';
import Revocation from './revocation';
import Withdrawal from './withdrawal';

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
  PermittedSpecies: PermittedSpecies(sequelize),
  PermittedActivity: PermittedActivity(sequelize),
  License: License(sequelize),
  LicenseAdvisory: LicenseAdvisory(sequelize),
  LicenseCondition: LicenseCondition(sequelize),
  Advisory: Advisory(sequelize),
  Condition: Condition(sequelize),
  Note: Note(sequelize),
  Revocation: Revocation(sequelize),
  Withdrawal: Withdrawal(sequelize),
};

// Relationships go here.
database.Application.belongsTo(database.Contact, {as: 'LicenceHolder', foreignKey: 'LicenceHolderId'});
database.Application.belongsTo(database.Contact, {as: 'LicenceApplicant', foreignKey: 'LicenceApplicantId'});
database.Application.belongsTo(database.Address, {as: 'LicenceHolderAddress', foreignKey: 'LicenceHolderAddressId'});
database.Application.belongsTo(database.Address, {as: 'SiteAddress', foreignKey: 'SiteAddressId'});
database.Application.belongsTo(database.Species, {as: 'Species', foreignKey: 'SpeciesId'});
database.Application.belongsTo(database.PermittedSpecies, {as: 'PermittedSpecies', foreignKey: 'PermittedSpeciesId'});

database.Contact.hasOne(database.Application, {as: 'LicenceHolder', foreignKey: 'LicenceHolderId'});
database.Contact.hasOne(database.Application, {as: 'LicenceApplicant', foreignKey: 'LicenceApplicantId'});
database.Address.hasOne(database.Application, {as: 'LicenceHolderAddress', foreignKey: 'LicenceHolderAddressId'});
database.Address.hasOne(database.Application, {as: 'SiteAddress', foreignKey: 'SiteAddressId'});
database.Species.hasOne(database.Application, {as: 'Species', foreignKey: 'SpeciesId'});
database.PermittedSpecies.hasOne(database.Application, {as: 'PermittedSpecies', foreignKey: 'PermittedSpeciesId'});

database.Assessment.belongsTo(database.Application, {as: 'ApplicationAssessment', foreignKey: 'ApplicationId'});
database.License.belongsTo(database.Application, {as: 'License', foreignKey: 'ApplicationId'});
database.Issue.belongsTo(database.Application, {as: 'ApplicationIssue', foreignKey: 'ApplicationId'});
database.Measure.belongsTo(database.Application, {as: 'ApplicationMeasure', foreignKey: 'ApplicationId'});
database.Note.belongsTo(database.Application, {as: 'ApplicationNotes', foreignKey: 'ApplicationId'});
database.Revocation.belongsTo(database.Application, {as: 'Revocation', foreignKey: 'ApplicationId'});
database.Withdrawal.belongsTo(database.Application, {as: 'Withdrawal', foreignKey: 'ApplicationId'});

database.Application.hasOne(database.Assessment, {as: 'ApplicationAssessment', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.License, {as: 'License', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Issue, {as: 'ApplicationIssue', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Measure, {as: 'ApplicationMeasure', foreignKey: 'ApplicationId'});
database.Application.hasMany(database.Note, {as: 'ApplicationNotes', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Revocation, {as: 'Revocation', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Withdrawal, {as: 'Withdrawal', foreignKey: 'ApplicationId'});

database.LicenseAdvisory.belongsTo(database.License, {as: 'LicenseAdvisories', foreignKey: 'LicenseId'});
database.LicenseCondition.belongsTo(database.License, {as: 'LicenseConditions', foreignKey: 'LicenseId'});

database.License.hasMany(database.LicenseAdvisory, {as: 'LicenseAdvisories', foreignKey: 'LicenseId'});
database.License.hasMany(database.LicenseCondition, {as: 'LicenseConditions', foreignKey: 'LicenseId'});

database.LicenseAdvisory.belongsTo(database.Advisory, {as: 'Advisory', foreignKey: 'AdvisoryId'});
database.LicenseCondition.belongsTo(database.Condition, {as: 'Condition', foreignKey: 'ConditionId'});

database.Advisory.hasMany(database.LicenseAdvisory, {as: 'Advisory', foreignKey: 'AdvisoryId'});
database.Condition.hasMany(database.LicenseCondition, {as: 'Condition', foreignKey: 'ConditionId'});

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

database.PermittedSpecies.belongsTo(database.PermittedActivity, {
  as: 'PermittedHerringGull',
  foreignKey: 'HerringGullId',
});
database.PermittedSpecies.belongsTo(database.PermittedActivity, {
  as: 'PermittedBlackHeadedGull',
  foreignKey: 'BlackHeadedGullId',
});
database.PermittedSpecies.belongsTo(database.PermittedActivity, {
  as: 'PermittedCommonGull',
  foreignKey: 'CommonGullId',
});
database.PermittedSpecies.belongsTo(database.PermittedActivity, {
  as: 'PermittedGreatBlackBackedGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.PermittedSpecies.belongsTo(database.PermittedActivity, {
  as: 'PermittedLesserBlackBackedGull',
  foreignKey: 'LesserBlackBackedGullId',
});

database.PermittedActivity.hasOne(database.PermittedSpecies, {as: 'PermittedHerringGull', foreignKey: 'HerringGullId'});
database.PermittedActivity.hasOne(database.PermittedSpecies, {
  as: 'PermittedBlackHeadedGull',
  foreignKey: 'BlackHeadedGullId',
});
database.PermittedActivity.hasOne(database.PermittedSpecies, {as: 'PermittedCommonGull', foreignKey: 'CommonGullId'});
database.PermittedActivity.hasOne(database.PermittedSpecies, {
  as: 'PermittedGreatBlackBackedGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.PermittedActivity.hasOne(database.PermittedSpecies, {
  as: 'PermittedLesserBlackBackedGull',
  foreignKey: 'LesserBlackBackedGullId',
});

export {database as default};
