import { Controller, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PROJECTS_PATTERNS } from '@app/common/patterns/projects';
import { UserExistsGuard } from './guards';
import { CreateProjectDto, UpdateProjectDto } from '@app/common/dto/projects';

@Controller()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern(PROJECTS_PATTERNS.CREATE)
  @UseGuards(UserExistsGuard)
  create(@Payload() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @MessagePattern(PROJECTS_PATTERNS.FIND_ALL)
  findAll() {
    return this.projectsService.findAll();
  }

  @MessagePattern(PROJECTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.projectsService.findOne(id);
  }

  @MessagePattern(PROJECTS_PATTERNS.UPDATE)
  @UseGuards(UserExistsGuard)
  update(@Payload() dto: UpdateProjectDto) {
    return this.projectsService.update(dto);
  }

  @MessagePattern(PROJECTS_PATTERNS.DELETE)
  delete(@Payload() id: string) {
    return this.projectsService.softDelete(id);
  }
}
