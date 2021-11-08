import databaseConfig from '../config/database.js';
import Sequelize from 'sequelize';

import Application from './application.js';

const sequelize = new Sequelize(databaseConfig.database);

const database = {
  sequelize,
  Application: Application(sequelize)
};

// Relationships go here.

export {database as default};
