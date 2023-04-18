import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmSqlConfigService } from './database/type-orm-sql-config.service';
import { ExampleModule } from './modules/example/example.module';
import { HealthModule } from './modules/app/health/health.module';
import { CoreModule } from './core/core.module';
import { ScrapperModule } from './modules/scrapper/scrapper.module';

@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRootAsync({
      imports: [DatabaseModule],
      useExisting: TypeOrmSqlConfigService,
    }),
    HealthModule,
    AppConfigModule,
    ExampleModule,
    ScrapperModule,
  ],
  exports: [],
})
export class AppModule {}
