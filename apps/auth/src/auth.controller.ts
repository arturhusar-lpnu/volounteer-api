import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_PATTERNS } from '@app/common/patterns/auth/message-pattern';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthResponseDto,
  LoginDto,
  RegisterDto,
  VerifyTokenResponseDto,
} from '@app/common/dto/auth';
import { ValidatedUser } from '@app/common/types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  async register(@Payload() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@Payload() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @MessagePattern(AUTH_PATTERNS.VERIFY_TOKEN)
  async verifyToken(@Payload() token: string): Promise<VerifyTokenResponseDto> {
    const payload = this.authService.verifyToken(token);
    const user = await this.authService.validateUser(payload.sub);

    return {
      valid: true,
      user,
      payload,
    };
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_USER)
  async validateUser(@Payload() userId: string): Promise<ValidatedUser> {
    return this.authService.validateUser(userId);
  }
}
