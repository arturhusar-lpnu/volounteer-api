import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  PROJECTS_SERVICE,
  TCP_PORTS,
  USERS_SERVICE,
} from '@app/common/constants/services';
import {
  ProjectsController,
  UsersController,
  AuthController,
} from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST || 'localhost',
          port: TCP_PORTS.USERS,
        },
      },
      {
        name: PROJECTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.PROJECTS_SERVICE_HOST || 'localhost',
          port: TCP_PORTS.PROJECTS,
        },
      },
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST || 'localhost',
          port: TCP_PORTS.AUTH,
        },
      },
    ]),
  ],
  controllers: [UsersController, ProjectsController, AuthController],
})
export class ApiGatewayModule {}
