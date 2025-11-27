import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQ_QUEUES, RMQ_SERVICES, RmqModule } from '@app/common';
import {
  UsersController,
  ProjectsController,
  AuthController,
} from './controllers';

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
    RmqModule.register({
      name: RMQ_SERVICES.AUTH,
      queue: RMQ_QUEUES.AUTH,
    }),
  ],
  controllers: [UsersController, ProjectsController, AuthController],
})
export class ApiGatewayRmqModule {}
