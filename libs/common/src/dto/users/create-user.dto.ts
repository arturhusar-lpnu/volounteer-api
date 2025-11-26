import { IsEmail, IsString, MinLength } from 'class-validator';
// import { USER_ROLES } from '@app/common/constants/enums';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  password: string;

  // role?: USER_ROLES;
}
