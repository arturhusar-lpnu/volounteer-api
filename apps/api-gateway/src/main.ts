import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('vol-api');
  const PORT = process.env.port ?? 3000;
  await app.listen(PORT);
  console.log(`API Gateway is running on http://localhost:${PORT}`);
}

void bootstrap();
