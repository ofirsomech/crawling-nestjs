import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AppLogger } from '../core/logger/logger';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  get isProduction(): boolean {
    return this.configService.get('application.nodeEnv') === 'production';
  }
}
