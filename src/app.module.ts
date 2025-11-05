import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/validations/app-config.schema';
import { dbConfig } from './config/db.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config.service';
import { Task } from './tasks/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => {
        const dbConfig = configService.get('dbConfig', { infer: true });
        return { ...dbConfig, entities: [Task] };
      },
    }),
    ConfigModule.forRoot({
      load: [appConfig, dbConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
      isGlobal: true,
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: TypedConfigService, useExisting: ConfigService },
  ],
})
export class AppModule {}
