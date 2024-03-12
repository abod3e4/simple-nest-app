import type { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from 'src/app.module';
import { I18nExceptionFilter } from '../exception-filter/i18n.filter';
import * as compression from 'compression';
import helmet from 'helmet';
import { Logger } from '@nestjs/common';
import { Server } from 'http';

export async function globalStartup(app: NestExpressApplication) {
  app.setGlobalPrefix('api');
  const logger = app.get(Logger);

  // ################ Middlewares ################
  app.enableCors({
    origin: '*',
    methods: ['GET, POST, OPTIONS, PUT, DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
    credentials: true,
  });

  app.useBodyParser('json', { limit: '10mb' });

  app.use(helmet());
  app.use(compression());
  // ############ global pipes ############
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ######## global Exception filter ########

  app.useGlobalFilters(new I18nExceptionFilter());

  // allows class-validator to use NestJS dependency injection container
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // listen on events

  app.enableShutdownHooks();

  process.on('unhandledRejection', err => {
    logger.error(err);
  });

  process.on('uncaughtException', err => {
    logger.error(err);
  });
}
