import * as Joi from 'joi';

export const appConfigSchema = Joi.object({
  APP_MESSAGE_PREFIX: Joi.string().default('Prefix'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNC: Joi.number().valid(0, 1).required(),
});
