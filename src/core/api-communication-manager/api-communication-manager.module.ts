import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppConfigModule } from '../../config/app-config.module';
import { ApiCommunicationManagerImplService } from './services/api-communication-manager-impl.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [AppConfigModule, HttpModule, LoggerModule],
  providers: [ApiCommunicationManagerImplService],
  exports: [ApiCommunicationManagerImplService],
})
export class ApiCommunicationManagerModule {}
