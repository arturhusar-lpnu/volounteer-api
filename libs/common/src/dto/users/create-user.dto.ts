import { USER_ROLES } from '@app/common/constants/enums';

export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  role?: USER_ROLES;
}
