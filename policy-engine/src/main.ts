import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Policy Engine runs on 3001
  await app.listen(3001);
}
bootstrap();
