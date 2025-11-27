import { Inject, Injectable } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AUTH_SERVICE } from '../constants/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TcpJwtGuard extends JwtAuthGuard {
  constructor(@Inject(AUTH_SERVICE) authClient: ClientProxy) {
    super(authClient);
  }
}
