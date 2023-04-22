import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/app-config.module';
import { HealthModule } from './modules/app/health/health.module';
import { ScrapperModule } from './modules/scrapper/scrapper.module';
import { TypeOrmSqlConfigService } from './database/type-orm-sql-config.service';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: TypeOrmSqlConfigService,
    }),
    HealthModule,
    AppConfigModule,
    ScrapperModule,
  ],
  exports: [],
})
export class AppModule {}
