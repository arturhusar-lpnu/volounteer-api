import { BaseRepostitory } from '@app/database/abstract.repository';
import { User } from '../entities';
import { IUserRepository } from './repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class UserRepository
  extends BaseRepostitory<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(userRepository);
  }
}
