import { registerAs } from '@nestjs/config';

export interface AppConfig {
  messagePrefix: string | undefined;
}

export const appConfig = registerAs(
  'appConfig',
  (): AppConfig => ({
    messagePrefix: process.env.APP_MESSAGE_PREFIX,
  }),
);
