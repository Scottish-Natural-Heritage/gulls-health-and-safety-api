interface AppConfig {
  pathPrefix: string;
  postcodeApiKey: string;
  databaseHost: string;
  licensingPassword: string;
  gullsPassword: string;
  roGullsPassword: string;
  notifyApiKey: string;
}

const config: AppConfig = {
  pathPrefix: '/gulls-health-and-safety-api/v1',
  postcodeApiKey: process.env.PC_LOOKUP_API_KEY ?? 'override_this_value',
  databaseHost: process.env.LICENSING_DB_HOST ?? 'localhost',
  licensingPassword: process.env.LICENSING_DB_PASS ?? 'override_this_value',
  gullsPassword: process.env.GULLS_DB_PASS ?? 'override_this_value',
  roGullsPassword: process.env.RO_GULLS_DB_PASS ?? 'override_this_value',
  notifyApiKey: process.env.GULLS_NOTIFY_TEST_KEY ?? 'override_this_value'
};

export default config;
