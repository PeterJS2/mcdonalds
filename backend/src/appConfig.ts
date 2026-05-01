import * as dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
  server: {
    port: process.env.PORT || 5000,
    jwtSecret: 'belajarpbpsecret'
  },
  database: {
    url: process.env.DATABASE_URL
  }
};
