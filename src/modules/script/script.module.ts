import { Module } from '@nestjs/common';
import { CoreModule } from '../../core/core.module';
import { ScriptService } from './services/script.service';
import { LoggerModule } from '../../core/logger/logger.module';
import { ScriptRepository } from './repositories/script.repository';

@Module({
  imports: [CoreModule, LoggerModule, LoggerModule],
  providers: [ScriptService, ScriptRepository],
  exports: [ScriptService],
})
export class ScriptModule {}
