import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags } from '@nestjs/swagger';
import { AppLogger } from '../../../core/logger/logger';

@ApiTags('Application')
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dns: HttpHealthIndicator,
    private readonly database: TypeOrmHealthIndicator,
    private readonly appLogger: AppLogger
  ) {
    appLogger.setContext(`${this.constructor.name}`);
  }

  @Get()
  @HealthCheck()
  healthCheck(): Promise<HealthCheckResult> {
    this.appLogger.debug('Starting healthCheck');
    return this.health.check([async () => this.database.pingCheck('database')]);
  }
}
