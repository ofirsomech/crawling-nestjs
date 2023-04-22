import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';
import * as basicAuth from 'express-basic-auth';
import { tracing } from './core/tracing/tracing';
import { AppLoggerImpl } from './core/logger/logger-impl';

declare const module;

async function bootstrap() {
  tracing();
  const app = await NestFactory.create(AppModule, {
    logger: console,
    cors: true,
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // Show error messages
      disableErrorMessages: false,
      // If user send extra data from the dto the data will be stripped
      whitelist: true,
      // To enable auto-transformation, set transform to true
      transform: true,
    })
  );

  app.setGlobalPrefix('api');

  const SWAGGER_URI = 'swagger-docs';

  const config = new DocumentBuilder()
    .setTitle('Crawling API')
    .setDescription('Crawling API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(SWAGGER_URI, app, document);

  app.use(helmet());

  // Allow this method on inside routes
  // app.use(csurf());

  app.useLogger(new AppLoggerImpl());

  const configService = app.get(ConfigService);
  const port = configService.get('application.port') || 8080;

  await app.listen(port);
  console.log('Server running on port:', port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
