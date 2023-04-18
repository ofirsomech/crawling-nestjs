import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { AppConfigService } from './app-config.service';
import databaseConfig from './database.config';
import appConfig from './app.config';
import { LoggerModule } from '../core/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['production.env', '.staging.env', 'development.env'],
      load: [databaseConfig, appConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('local', 'development', 'production', 'staging')
          .default('local'),
        LOG_LEVEL: Joi.string().default('debug'),
        PORT: Joi.number().port().default(8080),
        SALT: Joi.number().integer().positive(),
        DATABASE_HOST: Joi.string(),
        DATABASE_PORT: Joi.number().port(),
        DATABASE_USERNAME: Joi.string(),
        DATABASE_PASSWORD: Joi.string(),
        DATABASE_SCHEMA: Joi.string(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    LoggerModule,
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
