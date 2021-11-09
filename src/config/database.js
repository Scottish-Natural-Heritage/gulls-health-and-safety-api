const config = Object.freeze({
  port: '3017',
  pathPrefix: '/gulls-health-and-safety-api',
  gazetteerBaseUrl: 'https://cagmap.snh.gov.uk/gazetteer',
  postcodeApiKey: process.env.POSTCODE_API_KEY ?? 'override_this_value',
  databaseHost: process.env.LICENSING_DB_HOST || 'localhost',
  licensingPassword: process.env.LICENSING_DB_PASS || 'override_this_value',
  gullsPassword: process.env.GULLS_DB_PASS || 'override_this_value',
  roGullsPassword: process.env.RO_GULLS_DB_PASS || 'override_this_value'
});

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
