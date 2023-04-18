import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { StylesheetService } from './services/stylesheet.service';
import { LoggerModule } from '../../core/logger/logger.module';
import { StylesheetRepository } from './repositories/stylesheet.repository';

@Module({
  imports: [CoreModule, LoggerModule, LoggerModule],
  providers: [StylesheetService, StylesheetRepository],
  exports: [StylesheetService],
})
export class StylesheetModule {}
