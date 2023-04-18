import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmSqlConfigService } from './type-orm-sql-config.service';
import databaseConfig from '../config/database.config';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
  providers: [TypeOrmSqlConfigService],
  exports: [TypeOrmSqlConfigService],
})
export class DatabaseModule {}
