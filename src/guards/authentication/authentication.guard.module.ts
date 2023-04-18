import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../config/app-config.module';
import { AuthenticationGuard } from './authentication.guard';
import { LoggerModule } from '../../core/logger/logger.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AppConfigModule, HttpModule, LoggerModule],
  controllers: [],
  providers: [AuthenticationGuard],
  exports: [AuthenticationGuard],
})
export class AuthenticationGuardModule {}
