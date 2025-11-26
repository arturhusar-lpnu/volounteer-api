import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/common/patterns/users';
import {
  UpdateUserDto,
  CreateUserDto,
  DeleteUserDto,
} from '@app/common/dto/users';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERNS.CREATE)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern(USER_PATTERNS.FIND_ALL)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(USER_PATTERNS.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern(USER_PATTERNS.FIND_BY_EMAIL)
  findByEmail(@Payload() email: string) {
    return this.usersService.findByEmail(email);
  }

  @MessagePattern(USER_PATTERNS.UPDATE)
  updateOne(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(updateUserDto);
  }

  @MessagePattern(USER_PATTERNS.DELETE)
  removeOne(@Payload() deleteUserDto: DeleteUserDto) {
    return this.usersService.remove(deleteUserDto);
  }
}
