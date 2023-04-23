import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { LinkService } from './services/link.service';
import { LoggerModule } from '../../core/logger/logger.module';
import { LinkRepository } from './repositories/link.repository';

@Module({
  imports: [CoreModule, LoggerModule, LoggerModule],
  providers: [LinkService, LinkRepository],
  exports: [LinkService],
})
export class LinkModule {}
