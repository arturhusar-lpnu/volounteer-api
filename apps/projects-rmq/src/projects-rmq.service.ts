/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RMQ_SERVICES } from '@app/common';
import {
  CreateProjectDto,
  ProjectDto,
  UpdateProjectDto,
} from '@app/common/dto/projects';
import { USER_PATTERNS } from '@app/common/patterns/users';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'apps/projects/src/entities';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectsRepository: Repository<Project>,
    @Inject(RMQ_SERVICES.USERS) private usersClient: ClientProxy,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    // Перевіряємо існування користувача через RabbitMQ
    try {
      const user = await firstValueFrom(
        this.usersClient.send(USER_PATTERNS.FIND_ONE, dto.userId).pipe(
          timeout(5000), // Таймаут 5 секунд
          catchError((err) => {
            throw new BadRequestException(`User service error: ${err.message}`);
          }),
        ),
      );

      if (!user) {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw new BadRequestException(`Failed to verify user: ${error.message}`);
    }

    const project = this.projectsRepository.create(dto);
    return this.projectsRepository.save(project);
  }

  async findByUser(userId: string): Promise<Project[]> {
    return this.projectsRepository.find({ where: { userId } });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({ where: { id } });

    if (!project) throw new NotFoundException('Project not found');

    return project;
  }

  async findAll(): Promise<ProjectDto[]> {
    return this.projectsRepository.find();
  }

  async update(updateDto: UpdateProjectDto): Promise<ProjectDto> {
    const { id, ...rest } = updateDto;
    const entity = await this.projectsRepository.preload({
      id,
      ...rest,
    });

    if (!entity) {
      throw new NotFoundException('Project not found');
    }

    return this.projectsRepository.save(entity);
  }

  async softDelete(id: string): Promise<void> {
    const project = await this.findOne(id);

    project.active = false;

    await this.projectsRepository.save(project);
  }
}
