import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TCP_PORTS, USERS_SERVICE } from '@app/common/constants/services';
import { Project } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/projects/.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('PROJECTS_DB_HOST'),
        port: config.get('PROJECTS_DB_PORT'),
        username: config.get('PROJECTS_DB_USER'),
        password: config.get('PROJECTS_DB_PASSWORD'),
        database: config.get('PROJECTS_DB_NAME'),
        entities: [Project],
      }),
    }),
    TypeOrmModule.forFeature([Project]),
    ClientsModule.register([
      {
        name: USERS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.USERS_SERVICE_HOST || 'localhost',
          port: TCP_PORTS.USERS,
        },
      },
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
