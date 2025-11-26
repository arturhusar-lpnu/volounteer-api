import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { VerificationModule } from './verification.module';
import { TCP_PORTS } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    VerificationModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: TCP_PORTS.VERIFICATION,
      },
    },
  );

  await app.listen();
  console.log(
    `Verification Service is listening on port ${TCP_PORTS.VERIFICATION}`,
  );
}

void bootstrap();
