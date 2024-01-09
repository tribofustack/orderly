export const env = {
  isTest: process.env.NODE_ENV === 'test',

  dbHost: String(process.env.DB_HOST),
  dbPort: Number(process.env.DB_PORT),
  dbName: String(process.env.DB_NAME),
  dbUser: String(process.env.DB_USERNAME),
  dbPassword: String(process.env.DB_PASSWORD),
  dbDialect: String(process.env.DB_DIALECT),

  cacheHost: String(process.env.CACHE_HOST),
  cachePort: Number(process.env.CACHE_PORT),

  paymentIntegrationUrl: String(process.env.MP_URL),
  paymentIntegrationClientSecret: String(process.env.MP_CLIENT_SECRET),
  paymentIntegrationGrantType: String(process.env.MP_GRANT_TYPE),
  paymentIntegrationRefreshToken: String(process.env.MP_REFRESH_TOKEN),
};
