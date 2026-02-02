import { ConfigEnvironment, DatabaseType, NodeEnvType } from './config.type';

function getEnvVariable(key: string, defaultValue?: string): string {
  const value: string | undefined = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;

    throw new Error(`Environment variable ${key} is not defined`);
  }

  return value;
}

export default (): ConfigEnvironment => ({
  api: {
    port: +getEnvVariable('PORT'),
    host: getEnvVariable('HOST'),
  },
  environment: getEnvVariable('NODE_ENV') as NodeEnvType,
  register: {
    token_expiration_minutes: +getEnvVariable(
      'REGISTER_TOKEN_EXPIRATION_MINUTES',
    ),
  },
  database: {
    type: getEnvVariable('DATABASE_TYPE') as DatabaseType,
    host: getEnvVariable('DATABASE_HOST'),
    port: +getEnvVariable('DATABASE_PORT'),
    username: getEnvVariable('DATABASE_USERNAME'),
    password: getEnvVariable('DATABASE_PASSWORD'),
    database: getEnvVariable('DATABASE_NAME'),
  },
  redis: {
    host: getEnvVariable('REDIS_HOST'),
    port: +getEnvVariable('REDIS_PORT', '6379'),
  },
});
