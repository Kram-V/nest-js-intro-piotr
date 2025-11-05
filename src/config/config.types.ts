import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './app.config';

export interface ConfigType {
  appConfig: AppConfig;
  dbConfig: TypeOrmModule;
}
