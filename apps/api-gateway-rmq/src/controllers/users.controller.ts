/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
} from '@app/common/dto/users';
import { USER_PATTERNS } from '@app/common/patterns/users';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { RMQ_SERVICES } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(@Inject(RMQ_SERVICES.USERS) private usersClient: ClientProxy) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return firstValueFrom(
      this.usersClient.send(USER_PATTERNS.CREATE, dto).pipe(timeout(5000)),
    );
  }

  @Get()
  async findAll() {
    return firstValueFrom(
      this.usersClient.send(USER_PATTERNS.FIND_ALL, {}).pipe(timeout(5000)),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.usersClient.send(USER_PATTERNS.FIND_ONE, id).pipe(timeout(5000)),
    );
  }

  @Put('update')
  async update(@Body() updateDto: UpdateUserDto) {
    return firstValueFrom(
      this.usersClient
        .send(USER_PATTERNS.UPDATE, updateDto)
        .pipe(timeout(5000)),
    );
  }

  @Delete(':id/remove')
  async delete(@Param('id') id: string) {
    const payload: DeleteUserDto = { id };
    return firstValueFrom(
      this.usersClient.send(USER_PATTERNS.DELETE, payload).pipe(timeout(5000)),
    );
  }
}
