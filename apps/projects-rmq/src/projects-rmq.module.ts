import { Module } from '@nestjs/common';
import { ProjectsRmqController } from './projects-rmq.controller';
import { ProjectsService } from './projects-rmq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, PaymentLinks } from 'apps/projects/src/entities';
import { RMQ_QUEUES, RMQ_SERVICES, RmqModule, RmqService } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/projects-rmq/.env',
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
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Project, PaymentLinks]),
    RmqModule.register({
      name: RMQ_SERVICES.USERS,
      queue: RMQ_QUEUES.USERS,
    }),
  ],
  controllers: [ProjectsRmqController],
  providers: [ProjectsService, RmqService],
})
export class ProjectsRmqModule {}
