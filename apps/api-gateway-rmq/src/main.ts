import { NestFactory } from '@nestjs/core';
import { ApiGatewayRmqModule } from './api-gateway-rmq.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayRmqModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('volunteer-rqm-api');
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  console.log(`API Gateway RMQ is running on PORT : ${PORT}`);
}

void bootstrap();
