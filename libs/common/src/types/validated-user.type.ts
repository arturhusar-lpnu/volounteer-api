import { User } from 'apps/users/src/entities';

export type ValidatedUser = Omit<User, 'password'>;
