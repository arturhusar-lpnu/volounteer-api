import { Module } from '@nestjs/common';
import { UsersRmqController } from './users-rmq.controller';
import { UsersService } from './users-rmq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User } from 'apps/users/src/entities';
import { RmqService } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/users-rmq/.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('USERS_DB_HOST'),
        port: config.get('USERS_DB_PORT'),
        username: config.get('USERS_DB_USER'),
        password: config.get('USERS_DB_PASSWORD'),
        database: config.get('USERS_DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UsersRmqController],
  providers: [UsersService, RmqService],
})
export class UsersRmqModule {}
