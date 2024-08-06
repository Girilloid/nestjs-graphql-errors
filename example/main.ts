import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);

  const logger = new Logger();

  logger.log(`Application is running on ${await app.getUrl()}`);
}

bootstrap();
