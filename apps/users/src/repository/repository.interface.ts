import { IBaseRepository } from '@app/database/abstract.repository';
import { User } from '../entities';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUserRepository extends IBaseRepository<User> {}
