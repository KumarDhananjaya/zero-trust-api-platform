import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Audit Service runs on 3002
  await app.listen(3002);
}
bootstrap();
