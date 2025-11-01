import { getConfig } from '@app/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getConfig();
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: config.frontendUrl,
    credentials: true,
  });

  await app.listen(config.port);
  logger.log(`Service ready on port ${config.port}`);
}
bootstrap();
