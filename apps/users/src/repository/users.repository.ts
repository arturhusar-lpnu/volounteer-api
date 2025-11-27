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
    super(userRepository);
  }
}
