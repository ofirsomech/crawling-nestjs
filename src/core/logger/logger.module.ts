import { Module } from '@nestjs/common';
import { AppLoggerImpl } from './logger-impl';
import { AppLogger } from './logger';

@Module({
  providers: [
    {
      provide: AppLogger,
      useClass: AppLoggerImpl,
    },
  ],
  exports: [AppLogger],
})
export class LoggerModule {}
