interface AppConfig {
  port: string;
  pathPrefix: string;
  gazetteerBaseUrl: string;
  postcodeApiKey: string;
}

const config: AppConfig = {
  port: '3017',
  pathPrefix: '/gulls-health-and-safety-api',
  gazetteerBaseUrl: 'https://cagmap.snh.gov.uk/gazetteer',
  postcodeApiKey: process.env.POSTCODE_API_KEY ?? 'override_this_value',
};

export default config;
