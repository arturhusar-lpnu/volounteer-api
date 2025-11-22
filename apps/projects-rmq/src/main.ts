import { NestFactory } from '@nestjs/core';
import { ProjectsRmqModule } from './projects-rmq.module';
import { RMQ_QUEUES, RmqService } from '@app/common';

async function bootstrap() {
  const appContext =
    await NestFactory.createApplicationContext(ProjectsRmqModule);

  const rmqService = appContext.get<RmqService>(RmqService);

  const app = await NestFactory.createMicroservice(
    ProjectsRmqModule,
    rmqService.getOptions(RMQ_QUEUES.PROJECTS),
  );
  await app.listen();
  console.log(
    `Projects Service RMQ is listening on queue: ${RMQ_QUEUES.PROJECTS}`,
  );
}

void bootstrap();
