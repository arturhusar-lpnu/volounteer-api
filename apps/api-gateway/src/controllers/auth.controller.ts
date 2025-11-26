/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CurrentUser } from '@app/common/decorators';
import { LoginDto, RegisterDto } from '@app/common/dto/auth';
import { JwtAuthGuard } from '@app/common/guards';
import { AUTH_PATTERNS } from '@app/common/patterns/auth';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(@Inject() private readonly authClient: ClientProxy) {}

  @Post('register')
  async register(@Body(ValidationPipe) dto: RegisterDto) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.REGISTER, dto).pipe(timeout(5000)),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) dto: LoginDto) {
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.LOGIN, dto).pipe(timeout(5000)),
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    return {
      message: 'Authenticated successfully',
      user,
    };
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  verifyToken(@CurrentUser() user: any) {
    return {
      valid: true,
      user,
    };
  }
}
