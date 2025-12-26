import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // API Gateway runs on 8080
  await app.listen(8080);
}
bootstrap();
