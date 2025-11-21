/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities';
import { Repository } from 'typeorm';
import { USERS_SERVICE } from '@app/common/constants/services';
import { CreateProjectDto, ProjectDto } from '@app/common/dto/projects';
import { firstValueFrom } from 'rxjs';
import { USER_PATTERNS } from '@app/common/patterns/users';
import { ProjectStatus } from '@app/common/constants/enums';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private _projectsRepository: Repository<Project>,
    @Inject(USERS_SERVICE) private _usersClient,
  ) {}

  async create(dto: CreateProjectDto): Promise<ProjectDto> {
    try {
      const user = await firstValueFrom(
        this._usersClient.send(USER_PATTERNS.FIND_ONE, dto.userId),
      );

      if (!user) {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw new BadRequestException(`Failed to verify user: ${error.message}`);
    }

    const project = this._projectsRepository.create({
      name: dto.name,
      status: ProjectStatus.Created,
    });

    return this._projectsRepository.save(project);
  }
}
