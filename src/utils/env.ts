import { config as loadEnv } from 'dotenv';

loadEnv();

export const ENV = {
  baseUrl: process.env.BASE_URL || 'https://demo1.cybersoft.edu.vn',
  apiUrl: process.env.API_URL || 'https://movie0706.cybersoft.edu.vn/api',
  maNhom: process.env.MA_NHOM || 'GP09',
  testPassword: process.env.TEST_PASSWORD || 'Auto@123456',
  logLevel: (process.env.LOG_LEVEL || 'info') as 'debug' | 'info' | 'warn' | 'error',
};
