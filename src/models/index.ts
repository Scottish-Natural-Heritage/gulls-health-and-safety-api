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
database.Application.belongsTo(database.Contact);
database.Application.belongsTo(database.Address);
database.Application.belongsTo(database.Issue);
database.Application.belongsTo(database.Measure);
database.Application.belongsTo(database.Species);

database.Contact.hasMany(database.Application);
database.Address.hasMany(database.Application);
database.Issue.hasMany(database.Application);
database.Measure.hasMany(database.Application);
database.Species.hasMany(database.Application);

database.Species.belongsTo(database.Activity);
database.Activity.hasMany(database.Species);

export {database as default};