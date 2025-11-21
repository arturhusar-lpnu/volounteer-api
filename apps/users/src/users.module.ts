import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Role, User } from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/users/.env',
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
        // entities: [User, Role],
      }),
    }),
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
