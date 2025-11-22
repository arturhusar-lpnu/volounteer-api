import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQ_QUEUES, RMQ_SERVICES, RmqModule } from '@app/common';
import { UsersController, ProjectsController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RmqModule.register({
      name: RMQ_SERVICES.USERS,
      queue: RMQ_QUEUES.USERS,
    }),
    RmqModule.register({
      name: RMQ_SERVICES.PROJECTS,
      queue: RMQ_QUEUES.PROJECTS,
    }),
  ],
  controllers: [UsersController, ProjectsController],
})
export class ApiGatewayRmqModule {}
