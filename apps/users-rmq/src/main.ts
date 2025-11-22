import { NestFactory } from '@nestjs/core';
import { UsersRmqModule } from './users-rmq.module';
import { RMQ_QUEUES, RmqService } from '@app/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(UsersRmqModule);

  const rmqService = appContext.get<RmqService>(RmqService);

  const app = await NestFactory.createMicroservice(
    UsersRmqModule,
    rmqService.getOptions(RMQ_QUEUES.USERS),
  );

  await app.listen();
  console.log(`Users Service RMQ is listening on queue: ${RMQ_QUEUES.USERS}`);
}

void bootstrap();
