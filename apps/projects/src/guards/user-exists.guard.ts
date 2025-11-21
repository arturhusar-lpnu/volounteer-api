/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { USERS_SERVICE } from '@app/common/constants/services';
import { USER_PATTERNS } from '@app/common/patterns/users';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(@Inject(USERS_SERVICE) private readonly usersClient) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const data = context.switchToRpc().getData();

    const userId = data?.userId;
    if (!userId) return true;

    try {
      const user = await firstValueFrom(
        this.usersClient.send(USER_PATTERNS.FIND_ONE, userId),
      );

      if (!user) {
        throw new BadRequestException('User does not exist');
      }
    } catch (e) {
      throw new BadRequestException('Failed to validate user');
    }

    return true;
  }
}
