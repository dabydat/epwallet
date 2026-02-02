import * as Joi from 'joi';
import { ConfigSchema, nodeEnvTypes } from './config.type';

export const configValidation = Joi.object<ConfigSchema>({
  NODE_ENV: Joi.string().valid(...nodeEnvTypes).required(),
  PORT: Joi.number().required(),
  HOST: Joi.string().required(),
  DATABASE_TYPE: Joi.string().required(),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  REGISTER_TOKEN_EXPIRATION_MINUTES: Joi.number().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
});
