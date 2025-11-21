import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './users.module';
import { TCP_PORTS } from '@app/common/constants/services';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: TCP_PORTS.USERS,
      },
    },
  );

  await app.listen();
  console.log(`Users Service is listening on port ${TCP_PORTS.USERS}`);
}

void bootstrap();
