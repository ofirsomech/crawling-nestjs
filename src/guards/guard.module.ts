import { Module } from '@nestjs/common';
import { AuthenticationGuardModule } from './authentication/authentication.guard.module';
import { AppConfigModule } from '../config/app-config.module';

@Module({
  imports: [AuthenticationGuardModule, AppConfigModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class GuardModule {}
