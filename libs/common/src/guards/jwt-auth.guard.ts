/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { AUTH_PATTERNS } from '../patterns/auth';
import { VerifyTokenResponseDto } from '../dto/auth';

/** @internal */
export class JwtAuthGuard implements CanActivate {
  constructor(protected readonly authClient: ClientProxy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const res: VerifyTokenResponseDto = await firstValueFrom(
        this.authClient
          .send(AUTH_PATTERNS.VERIFY_TOKEN, token)
          .pipe(timeout(5000)),
      );

      if (!res.valid) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = res.user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token verification failed');
    }
  }

  private extractTokenFromHeader(req: any): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
