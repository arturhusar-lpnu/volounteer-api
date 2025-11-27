import { Controller } from '@nestjs/common';
import { AuthService as AuthRmqService } from './auth-rmq.service';
import { RmqBaseController } from '@app/common/rmq';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AUTH_PATTERNS } from '@app/common/patterns/auth';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  VerifyTokenResponseDto,
} from '@app/common/dto/auth';
import { ValidatedUser } from '@app/common/types';

@Controller()
export class AuthRmqController extends RmqBaseController {
  constructor(private readonly authService: AuthRmqService) {
    super();
  }

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(
    @Payload() dto: RegisterDto,
    @Ctx() ctx: RmqContext,
  ): Promise<AuthResponseDto> {
    const res = await this.authService.register(dto);
    this.acknowledgeMessage(ctx);
    return res;
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(
    @Payload() dto: LoginDto,
    @Ctx() ctx: RmqContext,
  ): Promise<AuthResponseDto> {
    const res = await this.authService.login(dto);
    this.acknowledgeMessage(ctx);
    return res;
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY_TOKEN)
  async verifyToken(
    @Payload() token: string,
    @Ctx() ctx: RmqContext,
  ): Promise<VerifyTokenResponseDto> {
    const payload = this.authService.verifyToken(token);
    const user = await this.authService.validateUser(payload.sub);
    this.acknowledgeMessage(ctx);
    return {
      valid: true,
      user,
      payload,
    };
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_USER)
  async validateUser(
    @Payload() userId: string,
    @Ctx() ctx: RmqContext,
  ): Promise<ValidatedUser> {
    const res = await this.authService.validateUser(userId);

    this.acknowledgeMessage(ctx);

    return res;
  }
}
