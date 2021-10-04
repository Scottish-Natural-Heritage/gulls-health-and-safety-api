interface AppConfig {
  port: string;
  pathPrefix: string;
  gazetterBaseUrl: string;
  postcodeApiKey: string;
}

const config: AppConfig = {
  port: '3017',
  pathPrefix: '/gulls-health-and-safety-api',
  gazetterBaseUrl: 'https://cagmap.snh.gov.uk/gazetteer',
  postcodeApiKey: process.env.POSTCODE_API_KEY ?? 'override_this_value',
};

export default config;
