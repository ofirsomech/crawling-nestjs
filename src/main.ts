import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { AppLoggerImpl } from './core/logger/logger-impl';
import { AppModule } from './app.module';
import { tracing } from './core/tracing/tracing';
import * as basicAuth from 'express-basic-auth';

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

  const SWAGGER_ENVS = ['local', 'development', 'staging'];
  const SWAGGER_URI = 'swagger-docs';

  if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
    app.use(
      [`/${SWAGGER_URI}`, `/${SWAGGER_URI}-json`],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      })
    );

    const config = new DocumentBuilder()
      .setTitle('NestJS StarterKit')
      .setDescription('StarterKit API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(SWAGGER_URI, app, document);
  }

  app.use(helmet());

  // Allow this method on inside routes
  // app.use(csurf());

  app.useLogger(new AppLoggerImpl());

  const configService = app.get(ConfigService);
  const port = configService.get('application.port') || 8080;

  await app.listen(port);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
