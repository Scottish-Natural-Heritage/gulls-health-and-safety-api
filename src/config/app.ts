interface AppConfig {
  port: string;
  pathPrefix: string;
  postcodeApiKey: string | undefined;
}

const config: AppConfig = {
  port: '3017',
  pathPrefix: '/gulls-health-and-safety-api',
  postcodeApiKey: process.env.POSTCODE_API_KEY,
};

export default config;
