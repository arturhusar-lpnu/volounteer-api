import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProjectsModule } from './projects.module';
import { TCP_PORTS } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProjectsModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: TCP_PORTS.PROJECTS,
      },
    },
  );
  await app.listen();
  console.log(`Orders Service is listening on port ${TCP_PORTS.PROJECTS}`);
}

void bootstrap();
