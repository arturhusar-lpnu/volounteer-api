import { Inject, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RMQ_SERVICES } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RmqJwtGuard extends JwtAuthGuard {
  constructor(@Inject(RMQ_SERVICES.AUTH) authClient: ClientProxy) {
    super(authClient);
  }
}
