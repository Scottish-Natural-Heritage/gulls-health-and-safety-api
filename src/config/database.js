import config from './app';

if (process.env.NODE_ENV === 'production') {
  module.exports = {
    preMigrations: {
      username: 'licensing',
      password: config.licensingPassword,
      database: 'licensing',
      host: config.databaseHost,
      dialect: 'postgres',
      schema: 'public',
      logging: false
    },
    database: {
      username: 'gulls',
      password: config.gullsPassword,
      database: 'licensing',
      host: config.databaseHost,
      dialect: 'postgres',
      schema: 'gulls',
      logging: false
    },
    ssDatabase: {
      username: 'rogulls',
      password: config.roGullsPassword,
      database: 'licensing',
      host: config.databaseHost,
      dialect: 'postgres',
      schema: 'gulls',
      logging: false
    }
  };
} else {
  module.exports = {
    preMigrations: {
      dialect: 'sqlite',
      storage: './.development.db',
      logging: false
    },
    database: {
      dialect: 'sqlite',
      storage: './.development.db',
      logging: false
    }
  };
}
