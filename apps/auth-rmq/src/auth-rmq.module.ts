import { Module } from '@nestjs/common';
import { AuthRmqController } from './auth-rmq.controller';
import { AuthService as AuthRmqService } from './auth-rmq.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RMQ_QUEUES, RMQ_SERVICES, RmqModule, RmqService } from '@app/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'apps/auth/src/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth-rmq/.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'super-secret-key',
        signOptions: {
          expiresIn:
            Number(config.get<string>('JWT_EXPIRES_IN')) || 60 * 60 * 24,
        },
      }),
    }),
    RmqModule.register({
      name: RMQ_SERVICES.USERS,
      queue: RMQ_QUEUES.USERS,
    }),
  ],
  controllers: [AuthRmqController],
  providers: [AuthRmqService, RmqService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthRmqModule {}
