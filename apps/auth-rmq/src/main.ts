import { NestFactory } from '@nestjs/core';
import { AuthRmqModule } from './auth-rmq.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RMQ_QUEUES, RmqService } from '@app/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AuthRmqModule);
  const rmqService = appContext.get<RmqService>(RmqService);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthRmqModule,
    rmqService.getOptions(RMQ_QUEUES.AUTH),
  );

  await app.listen();

  console.log(`Auth Service RMQ is listening on queue: ${RMQ_QUEUES.AUTH}`);
}

void bootstrap();
