import { TypeOrmModuleOptions } from './../../node_modules/@nestjs/typeorm/dist/interfaces/typeorm-options.interface.d';
import { registerAs } from '@nestjs/config';

export const dbConfig = registerAs(
  'dbConfig',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: Boolean(process.env.DB_SYNC ?? false),
  }),
);
