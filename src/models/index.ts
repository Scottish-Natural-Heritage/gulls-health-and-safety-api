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
import PSpecies from './p-species';
import PActivity from './p-activity';
import License from './license';
import LicenseAdvisory from './license-advisory';
import LicenseCondition from './license-condition';
import Advisory from './advisory';
import Condition from './condition';
import Note from './note';
import Revocation from './revocation';
import Withdrawal from './withdrawal';
import Returns from './returns';
import RSpecies from './r-species';
import RActivity from './r-activities';
import AssessmentMeasure from './assessment-measure';
import ASpecies from './a-species';
import AActivity from './a-activity';
import Amendment from './amendment';
import AmendCondition from './amend-condition';
import AmendAdvisory from './amend-advisory';

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
  PSpecies: PSpecies(sequelize),
  PActivity: PActivity(sequelize),
  License: License(sequelize),
  LicenseAdvisory: LicenseAdvisory(sequelize),
  LicenseCondition: LicenseCondition(sequelize),
  Advisory: Advisory(sequelize),
  Condition: Condition(sequelize),
  Note: Note(sequelize),
  Revocation: Revocation(sequelize),
  Withdrawal: Withdrawal(sequelize),
  Returns: Returns(sequelize),
  RSpecies: RSpecies(sequelize),
  RActivity: RActivity(sequelize),
  AssessmentMeasure: AssessmentMeasure(sequelize),
  ASpecies: ASpecies(sequelize),
  AActivity: AActivity(sequelize),
  Amendment: Amendment(sequelize),
  AmendCondition: AmendCondition(sequelize),
  AmendAdvisory: AmendAdvisory(sequelize),
};

// Relationships go here.
database.Application.belongsTo(database.Contact, {as: 'LicenceHolder', foreignKey: 'LicenceHolderId'});
database.Application.belongsTo(database.Contact, {as: 'LicenceApplicant', foreignKey: 'LicenceApplicantId'});
database.Application.belongsTo(database.Address, {as: 'LicenceHolderAddress', foreignKey: 'LicenceHolderAddressId'});
database.Application.belongsTo(database.Address, {as: 'SiteAddress', foreignKey: 'SiteAddressId'});
database.Application.belongsTo(database.Species, {as: 'Species', foreignKey: 'SpeciesId'});
database.Application.belongsTo(database.PSpecies, {as: 'PSpecies', foreignKey: 'PermittedSpeciesId'});

database.Contact.hasOne(database.Application, {as: 'LicenceHolder', foreignKey: 'LicenceHolderId'});
database.Contact.hasOne(database.Application, {as: 'LicenceApplicant', foreignKey: 'LicenceApplicantId'});
database.Address.hasOne(database.Application, {as: 'LicenceHolderAddress', foreignKey: 'LicenceHolderAddressId'});
database.Address.hasOne(database.Application, {as: 'SiteAddress', foreignKey: 'SiteAddressId'});
database.Species.hasOne(database.Application, {as: 'Species', foreignKey: 'SpeciesId'});
database.PSpecies.hasOne(database.Application, {as: 'PSpecies', foreignKey: 'PermittedSpeciesId'});

database.Assessment.belongsTo(database.Application, {as: 'ApplicationAssessment', foreignKey: 'ApplicationId'});
database.License.belongsTo(database.Application, {as: 'License', foreignKey: 'ApplicationId'});
database.Issue.belongsTo(database.Application, {as: 'ApplicationIssue', foreignKey: 'ApplicationId'});
database.Measure.belongsTo(database.Application, {as: 'ApplicationMeasure', foreignKey: 'ApplicationId'});
database.Note.belongsTo(database.Application, {as: 'ApplicationNotes', foreignKey: 'ApplicationId'});
database.Revocation.belongsTo(database.Application, {as: 'Revocation', foreignKey: 'ApplicationId'});
database.Withdrawal.belongsTo(database.Application, {as: 'Withdrawal', foreignKey: 'ApplicationId'});
database.AssessmentMeasure.belongsTo(database.Application, {as: 'AssessmentMeasure', foreignKey: 'ApplicationId'});

database.Application.hasOne(database.Assessment, {as: 'ApplicationAssessment', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.License, {as: 'License', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Issue, {as: 'ApplicationIssue', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Measure, {as: 'ApplicationMeasure', foreignKey: 'ApplicationId'});
database.Application.hasMany(database.Note, {as: 'ApplicationNotes', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Revocation, {as: 'Revocation', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.Withdrawal, {as: 'Withdrawal', foreignKey: 'ApplicationId'});
database.Application.hasOne(database.AssessmentMeasure, {as: 'AssessmentMeasure', foreignKey: 'ApplicationId'});

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

database.PSpecies.belongsTo(database.PActivity, {
  as: 'PHerringGull',
  foreignKey: 'HerringGullId',
});
database.PSpecies.belongsTo(database.PActivity, {
  as: 'PBlackHeadedGull',
  foreignKey: 'BlackHeadedGullId',
});
database.PSpecies.belongsTo(database.PActivity, {
  as: 'PCommonGull',
  foreignKey: 'CommonGullId',
});
database.PSpecies.belongsTo(database.PActivity, {
  as: 'PGreatBlackBackedGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.PSpecies.belongsTo(database.PActivity, {
  as: 'PLesserBlackBackedGull',
  foreignKey: 'LesserBlackBackedGullId',
});

database.PActivity.hasOne(database.PSpecies, {as: 'PHerringGull', foreignKey: 'HerringGullId'});
database.PActivity.hasOne(database.PSpecies, {
  as: 'PBlackHeadedGull',
  foreignKey: 'BlackHeadedGullId',
});
database.PActivity.hasOne(database.PSpecies, {as: 'PCommonGull', foreignKey: 'CommonGullId'});
database.PActivity.hasOne(database.PSpecies, {
  as: 'PGreatBlackBackedGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.PActivity.hasOne(database.PSpecies, {
  as: 'PLesserBlackBackedGull',
  foreignKey: 'LesserBlackBackedGullId',
});

database.Returns.belongsTo(database.RSpecies, {as: 'RSpecies', foreignKey: 'SpeciesId'});
database.RSpecies.hasOne(database.Returns, {as: 'RSpecies', foreignKey: 'SpeciesId'});
database.Returns.belongsTo(database.License, {as: 'Returns', foreignKey: 'LicenceId'});
database.License.hasMany(database.Returns, {as: 'Returns', foreignKey: 'LicenceId'});

database.RSpecies.belongsTo(database.RActivity, {as: 'RHerringGull', foreignKey: 'HerringGullId'});
database.RSpecies.belongsTo(database.RActivity, {
  as: 'RBlackHGull',
  foreignKey: 'BlackHeadedGullId',
});
database.RSpecies.belongsTo(database.RActivity, {as: 'RCommonGull', foreignKey: 'CommonGullId'});
database.RSpecies.belongsTo(database.RActivity, {
  as: 'RGreatBBGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.RSpecies.belongsTo(database.RActivity, {
  as: 'RLesserBBGull',
  foreignKey: 'LesserBlackBackedGullId',
});

database.RActivity.hasOne(database.RSpecies, {as: 'RHerringGull', foreignKey: 'HerringGullId'});
database.RActivity.hasOne(database.RSpecies, {as: 'RBlackHGull', foreignKey: 'BlackHeadedGullId'});
database.RActivity.hasOne(database.RSpecies, {as: 'RCommonGull', foreignKey: 'CommonGullId'});
database.RActivity.hasOne(database.RSpecies, {
  as: 'RGreatBBGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.RActivity.hasOne(database.RSpecies, {
  as: 'RLesserBBGull',
  foreignKey: 'LesserBlackBackedGullId',
});

database.Amendment.belongsTo(database.License, {as: 'Amendment', foreignKey: 'LicenceId'});
database.License.hasMany(database.Amendment, {as: 'Amendment', foreignKey: 'LicenceId'});

database.Amendment.belongsTo(database.ASpecies, {as: 'ASpecies', foreignKey: 'SpeciesId'});
database.ASpecies.hasOne(database.Amendment, {as: 'ASpecies', foreignKey: 'SpeciesId'});

database.ASpecies.belongsTo(database.AActivity, {as: 'AHerringGull', foreignKey: 'HerringGullId'});
database.ASpecies.belongsTo(database.AActivity, {
  as: 'ABlackHGull',
  foreignKey: 'BlackHeadedGullId',
});
database.ASpecies.belongsTo(database.AActivity, {as: 'ACommonGull', foreignKey: 'CommonGullId'});
database.ASpecies.belongsTo(database.AActivity, {
  as: 'AGreatBBGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.ASpecies.belongsTo(database.AActivity, {
  as: 'ALesserBBGull',
  foreignKey: 'LesserBlackBackedGullId',
});

database.AActivity.hasOne(database.ASpecies, {as: 'AHerringGull', foreignKey: 'HerringGullId'});
database.AActivity.hasOne(database.ASpecies, {as: 'ABlackHGull', foreignKey: 'BlackHeadedGullId'});
database.AActivity.hasOne(database.ASpecies, {as: 'ACommonGull', foreignKey: 'CommonGullId'});
database.AActivity.hasOne(database.ASpecies, {
  as: 'AGreatBBGull',
  foreignKey: 'GreatBlackBackedGullId',
});
database.AActivity.hasOne(database.ASpecies, {
  as: 'ALesserBBGull',
  foreignKey: 'LesserBlackBackedGullId',
});

database.AmendAdvisory.belongsTo(database.Amendment, {as: 'AmendAdvisories', foreignKey: 'AmendmentId'});
database.AmendCondition.belongsTo(database.Amendment, {as: 'AmendConditions', foreignKey: 'AmendmentId'});

database.Amendment.hasMany(database.AmendAdvisory, {as: 'AmendAdvisories', foreignKey: 'AmendmentId'});
database.Amendment.hasMany(database.AmendCondition, {as: 'AmendConditions', foreignKey: 'AmendmentId'});

database.AmendAdvisory.belongsTo(database.Advisory, {as: 'AmendAdvisory', foreignKey: 'AdvisoryId'});
database.AmendCondition.belongsTo(database.Condition, {as: 'AmendCondition', foreignKey: 'ConditionId'});

database.Advisory.hasMany(database.AmendAdvisory, {as: 'AmendAdvisory', foreignKey: 'AdvisoryId'});
database.Condition.hasMany(database.AmendCondition, {as: 'AmendCondition', foreignKey: 'ConditionId'});

export {database as default};
