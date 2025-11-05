import { Injectable } from '@nestjs/common';
import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/typed-config.service';

@Injectable()
export class AppService {
  constructor(private readonly configService: TypedConfigService) {}

  getHello(): string | undefined {
    const prefix =
      this.configService.get<AppConfig>('appConfig')?.messagePrefix;

    return prefix;
  }
}
