import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities';
import { Repository } from 'typeorm';
import {
  CreateProjectDto,
  ProjectDto,
  UpdateProjectDto,
} from '@app/common/dto/projects';
import { ProjectStatus } from '@app/common/constants/enums';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projectsRepository: Repository<Project>,
  ) {}

  async create(dto: CreateProjectDto): Promise<ProjectDto> {
    const project = this.projectsRepository.create({
      name: dto.name,
      status: ProjectStatus.Created,
      active: true,
    });

    return this.projectsRepository.save(project);
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
