import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { ScreenshotService } from './services/screenshot.service';
import { LoggerModule } from '../../core/logger/logger.module';
import { ScreenshotRepository } from './repositories/screenshot.repository';
import { ScreenshotController } from './controllers/screenshot.controller';
import { ScrapperController } from '../scrapper/controllers/api/v1/scrapper.controller';

@Module({
  controllers: [ScreenshotController],
  imports: [CoreModule, LoggerModule, LoggerModule],
  providers: [ScreenshotService, ScreenshotRepository],
  exports: [ScreenshotService],
})
export class ScreenshotModule {}
