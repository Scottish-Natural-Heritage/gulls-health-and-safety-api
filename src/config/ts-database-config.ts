import config from './app';

const databaseConfig = {
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

export { databaseConfig };
