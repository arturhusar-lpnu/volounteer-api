/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller } from '@nestjs/common';
import { UsersService } from './users-rmq.service';
import { USER_PATTERNS } from '@app/common/patterns/users';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto, UpdateUserDto } from '@app/common/dto/users';

@Controller()
export class UsersRmqController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(USER_PATTERNS.CREATE)
  async create(@Payload() data: CreateUserDto, @Ctx() context: RmqContext) {
    const result = await this.usersService.create(data);

    this.acknowledgeMessage(context);

    return result;
  }

  @MessagePattern(USER_PATTERNS.FIND_ALL)
  async findAll(@Ctx() context: RmqContext) {
    const result = await this.usersService.findAll();
    this.acknowledgeMessage(context);
    return result;
  }

  @MessagePattern(USER_PATTERNS.FIND_ONE)
  async findOne(@Payload() id: string, @Ctx() context: RmqContext) {
    const result = await this.usersService.findOne(id);
    this.acknowledgeMessage(context);
    return result;
  }

  @MessagePattern(USER_PATTERNS.UPDATE)
  async update(
    @Payload() updateUserDto: UpdateUserDto,
    @Ctx() context: RmqContext,
  ) {
    const result = await this.usersService.update(
      updateUserDto.id,
      updateUserDto,
    );

    this.acknowledgeMessage(context);
    return result;
  }

  @MessagePattern(USER_PATTERNS.DELETE)
  async delete(@Payload() id: string, @Ctx() context: RmqContext) {
    const result = await this.usersService.delete(id);

    this.acknowledgeMessage(context);
    return result;
  }

  private acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }
}
