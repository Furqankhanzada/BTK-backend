import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose']
  });
  app.setGlobalPrefix('api/v1');
  app.enableCors(); // add this line
  await app.listen(parseInt(process.env.PORT, 10) || 3000);
}
bootstrap();
