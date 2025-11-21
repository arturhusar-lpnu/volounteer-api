import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  GetUserDto,
  UpdateUserDto,
  DeleteUserDto,
} from '@app/common/dto/users';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<GetUserDto> {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateOne(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, ...rest } = updateUserDto;

    const entity = await this.userRepository.preload({ id, ...rest });
    if (!entity) throw new NotFoundException('User not found');

    return await this.userRepository.save(entity);
  }

  async remove(deleteUserDto: DeleteUserDto): Promise<void> {
    const { id, email } = deleteUserDto;

    if (!id && !email) {
      throw new BadRequestException('Either id or email must be provided');
    }

    const user = await this.userRepository.findOne({
      where: id ? { id } : { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.active = false;

    await this.userRepository.save(user);
  }
}
