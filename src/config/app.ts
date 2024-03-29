interface AppConfig {
  pathPrefix: string;
  postcodeApiEndpoint: string;
  postcodeApiKey: string;
  databaseHost: string;
  licensingPassword: string;
  gullsPassword: string;
  roGullsPassword: string;
  underTest: boolean;
  notifyApiKey: string | null;
  hostPrefix: string;
  gullsApiPort: number;
}

const config: AppConfig = {
  pathPrefix: '/gulls-health-and-safety-api/v1',
  postcodeApiEndpoint: process.env.PC_API_URL ?? 'https://cagmap.snh.gov.uk/gazetteer',
  postcodeApiKey: process.env.PC_LOOKUP_API_KEY ?? 'override_this_value',
  databaseHost: process.env.LICENSING_DB_HOST ?? 'localhost',
  licensingPassword: process.env.LICENSING_DB_PASS ?? 'override_this_value',
  gullsPassword: process.env.GULLS_DB_PASS ?? 'override_this_value',
  roGullsPassword: process.env.RO_GULLS_DB_PASS ?? 'override_this_value',
  underTest: Boolean(process.env.UNDER_TEST),
  notifyApiKey: process.env.GULLS_NOTIFY_API_KEY ?? null,
  hostPrefix: process.env.GULLS_HOST_PREFIX ?? 'http://localhost:3016',
  gullsApiPort: 3017,
};

export default config;
