import config from './app';

const productionDatabaseConfig = {
  preMigrations: {
    username: 'licensing',
    password: config.licensingPassword,
    database: 'licensing',
    host: config.databaseHost,
    dialect: 'postgres',
    schema: 'public',
    logging: false,
  },
  database: {
    username: 'gulls',
    password: config.gullsPassword,
    database: 'licensing',
    host: config.databaseHost,
    dialect: 'postgres',
    schema: 'gulls',
    logging: false,
  },
  ssDatabase: {
    username: 'rogulls',
    password: config.roGullsPassword,
    database: 'licensing',
    host: config.databaseHost,
    dialect: 'postgres',
    schema: 'gulls',
    logging: false,
  },
};

const localDatabaseConfig = {
  preMigrations: {
    dialect: 'sqlite',
    storage: './.development.db',
    logging: false,
  },
  database: {
    dialect: 'sqlite',
    storage: './.development.db',
    logging: false,
  },
};

export {productionDatabaseConfig, localDatabaseConfig};
