import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type  { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Server } from 'http';
import { globalStartup, gracefulShutdown } from './common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // ############ startup ############
  await globalStartup(app);
  // ############ startup ############

  const server: Server = await app.listen(config.get<number>('PORT'));

  // graceful shutdown
  gracefulShutdown(server, app);
}
bootstrap();
