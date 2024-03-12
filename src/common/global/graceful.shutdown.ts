import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Server } from 'http';
import mongoose from 'mongoose';

export function gracefulShutdown(server: Server, app: NestExpressApplication) {
  const logger = app.get(Logger);

  process.on('SIGINT', () => {
    mongoose.connection.close();
    mongoose.connection.on('close', () => {
      logger.log('MongodDB closed successfully.');
    });
    logger.log('SIGTERM signal received.');
    logger.log('Closing http server.');
    server.close();
  });

  server.on('close', () => {
    logger.log('Http server closed.');
  });
}
