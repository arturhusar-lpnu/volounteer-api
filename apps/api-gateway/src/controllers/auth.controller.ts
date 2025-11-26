/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { AUTH_SERVICE } from '@app/common';
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
  Logger,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {
    this.logger.log('✅ AuthController initialized');
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    this.logger.log('Registration attempt from auth controller in api gateway');
    return firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.REGISTER, dto).pipe(timeout(5000)),
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) dto: LoginDto) {
    const response = await firstValueFrom(
      this.authClient.send(AUTH_PATTERNS.LOGIN, dto).pipe(timeout(5000)),
    );

    return response;
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
