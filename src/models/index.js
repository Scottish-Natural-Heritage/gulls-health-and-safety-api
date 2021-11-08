import databaseConfig from '../config/database.js';
import Sequelize from 'sequelize';

const sequelize = new Sequelize(databaseConfig.database);

const database = {};

// Relationships go here.

export {database as default};
