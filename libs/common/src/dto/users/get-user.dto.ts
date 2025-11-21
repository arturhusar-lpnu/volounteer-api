import { USER_ROLES } from '@app/common/constants/enums/user-roles.enum';

export class GetUserDto {
  id: string;
  email: string;
  name: string;
  roles: USER_ROLES[];
  createdAt: Date;
}
