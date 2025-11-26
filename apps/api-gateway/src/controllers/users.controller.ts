import { USERS_SERVICE } from '@app/common';
import {
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
} from '@app/common/dto/users';
import { JwtAuthGuard } from '@app/common/guards';
import { USER_PATTERNS } from '@app/common/patterns/users';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateUserDto) {
    return firstValueFrom(this.usersClient.send(USER_PATTERNS.CREATE, dto));
  }

  @Get()
  findAll() {
    return firstValueFrom(this.usersClient.send(USER_PATTERNS.FIND_ALL, {}));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(this.usersClient.send(USER_PATTERNS.FIND_ONE, id));
  }

  @Patch('update')
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateUserDto) {
    return firstValueFrom(
      this.usersClient.send(USER_PATTERNS.UPDATE, { ...dto }),
    );
  }

  @Delete(':id/remove')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    const payload: DeleteUserDto = { id };
    return firstValueFrom(this.usersClient.send(USER_PATTERNS.DELETE, payload));
  }
}
