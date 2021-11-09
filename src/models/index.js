import databaseConfig from '../config/database.js';
import Sequelize from 'sequelize';

import Application from './application.js';
import Contact from './contact.js';
import Address from './address.js';
import Issue from './issue.js';
import Measure from './measure.js';
import Species from './species.js';
import Activity from './activity.js';

const sequelize = new Sequelize(databaseConfig.database);

const database = {
  sequelize,
  Application: Application(sequelize),
  Contact: Contact(sequelize),
  Address: Address(sequelize),
  Issue: Issue(sequelize),
  Measure: Measure(sequelize),
  Species: Species(sequelize),
  Activity: Activity(sequelize)
};

// Relationships go here.
database.Application.hasMany(database.Contact);
database.Application.hasMany(database.Address);
database.Application.hasOne(database.Issue);
database.Application.hasOne(database.Measure);
database.Application.hasOne(database.Species);

database.Contact.belongsTo(database.Application);
database.Address.belongsTo(database.Application);
database.Issue.belongsTo(database.Application);
database.Measure.belongsTo(database.Application);
database.Species.belongsTo(database.Application);

database.Species.hasMany(database.Activity);
database.Activity.belongsTo(database.Species);

export {database as default};
