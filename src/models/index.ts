// import {Sequelize} from 'sequelize';
// import databaseConfig from '../config/database.js';
import {productionDbConfig, localDbConfig} from '../config/tsDbConfig';
import Application from './application';
import Contact from './contact';
import Address from './address';
import Issue from './issue';
import Measure from './measure';
import Species from './species';
import Activity from './activity';

const Sequelize = require('sequelize');

let envProd: boolean = false;

if (process.env.NODE_ENV === 'production') {
  envProd = true;
}

// const databaseConfig =  {
//   database: {
//     dialect: 'sqlite',
//     storage: './.development.db',
//     logging: false,
//   }
// }

let sequelize = new Sequelize(localDbConfig.database);

// const databaseConfig = require('../config/database.js').database;
if (envProd) {
  sequelize = new Sequelize(productionDbConfig.database);
}

const database = {
  sequelize,
  Application: Application(sequelize),
  Contact: Contact(sequelize),
  Address: Address(sequelize),
  Issue: Issue(sequelize),
  Measure: Measure(sequelize),
  Species: Species(sequelize),
  Activity: Activity(sequelize),
};

// Relationships go here.
database.Application.hasMany(database.Contact);
// database.Application.hasMany(database.Address);
database.Application.hasOne(database.Issue);
database.Application.hasOne(database.Measure);
database.Application.hasOne(database.Species);

database.Contact.belongsTo(database.Application);
// database.Address.belongsTo(database.Application);
database.Issue.belongsTo(database.Application);
database.Measure.belongsTo(database.Application);
database.Species.belongsTo(database.Application);

database.Species.hasMany(database.Activity);
database.Activity.belongsTo(database.Species);

export {database as default};
