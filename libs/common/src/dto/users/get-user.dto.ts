import { USER_ROLES } from '@app/common/constants/enums';

export class UserDto {
  id: string;
  email: string;
  name: string;
  roles: USER_ROLES[];
  createdAt: Date;
}
