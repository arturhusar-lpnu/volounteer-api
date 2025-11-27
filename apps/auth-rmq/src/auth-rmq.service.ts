/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RMQ_SERVICES } from '@app/common';
import {
  AuthResponseDto,
  JwtPayload,
  LoginDto,
  RegisterDto,
} from '@app/common/dto/auth';
import { CreateUserDto } from '@app/common/dto/users';
import { USER_PATTERNS } from '@app/common/patterns/users';
import { ValidatedUser } from '@app/common/types';
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { User } from 'apps/users/src/entities';
import * as bcrypt from 'bcrypt';
import { catchError, firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly SALT_ROUNDS = 10;

  constructor(
    @Inject(RMQ_SERVICES.AUTH)
    private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    this.logger.log(`Registration attempt for email: ${dto.email}`);

    const existingUser = await this.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    const createUserDto: CreateUserDto = {
      email: dto.email,
      name: dto.name,
      password: hashedPassword,
    };

    try {
      const user: User = await firstValueFrom(
        this.usersClient.send(USER_PATTERNS.CREATE, createUserDto).pipe(
          timeout(5000),
          catchError((error) => {
            this.logger.error(`Failed to create user: ${error.message}`);
            throw new ConflictException('Failed to create user');
          }),
        ),
      );

      this.logger.log(`User created successfully: ${user.id}`);

      return this.generateAuthResponse(user);
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Login attempt for email: ${dto.email}`);

    const user = await this.findUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for email: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in successfully: ${user.id}`);

    return this.generateAuthResponse(user);
  }

  async validateUser(userId: string): Promise<ValidatedUser> {
    this.logger.debug(`Validating user: ${userId}`);

    try {
      const user: User = await firstValueFrom(
        this.usersClient.send(USER_PATTERNS.FIND_ONE, userId).pipe(
          timeout(5000),
          catchError((error) => {
            this.logger.error(`User validation failed: ${error.message}`);
            throw new UnauthorizedException('Invalid token');
          }),
        ),
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const { password, ...result } = user;
      return result as ValidatedUser;
    } catch (error) {
      this.logger.error(`User validation error: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  verifyToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user: User = await firstValueFrom(
        this.usersClient
          .send(USER_PATTERNS.FIND_BY_EMAIL, { email })
          .pipe(timeout(5000)),
      );

      return user;
    } catch (error) {
      this.logger.error(`Failed to find user by email: ${error.message}`);
      return null;
    }
  }

  private generateAuthResponse(user: User): AuthResponseDto {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
