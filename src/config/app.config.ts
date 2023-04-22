import { registerAs } from '@nestjs/config';

export default registerAs('application', () => ({
  name: process.env.SERVICE_NAME,
  port: Number.parseInt(process.env.PORT, 10),
  salt: Number.parseInt(process.env.SALT, 10),
  nodeEnv: process.env.NODE_ENV,
  logLevel: process.env.LOG_LEVEL,
  dockerEnv: process.env.DOCKER_ENV,
  baseUrl: process.env.BASE_URL,
}));
