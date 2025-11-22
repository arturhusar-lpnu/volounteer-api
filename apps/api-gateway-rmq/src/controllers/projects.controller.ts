import { RMQ_SERVICES } from '@app/common';
import { CreateProjectDto, UpdateProjectDto } from '@app/common/dto/projects';
import { PROJECTS_PATTERNS } from '@app/common/patterns/projects';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(RMQ_SERVICES.PROJECTS) private readonly projectsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return firstValueFrom(
      this.projectsClient
        .send(PROJECTS_PATTERNS.CREATE, dto)
        .pipe(timeout(5000)),
    );
  }

  @Get()
  findAll() {
    return firstValueFrom(
      this.projectsClient
        .send(PROJECTS_PATTERNS.FIND_ALL, {})
        .pipe(timeout(5000)),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.projectsClient
        .send(PROJECTS_PATTERNS.FIND_ONE, id)
        .pipe(timeout(5000)),
    );
  }

  @Patch('update')
  update(@Body() dto: UpdateProjectDto) {
    const payload = { ...dto };

    return firstValueFrom(
      this.projectsClient
        .send(PROJECTS_PATTERNS.UPDATE, payload)
        .pipe(timeout(5000)),
    );
  }

  @Delete(':id/remove')
  delete(@Param('id') id: string) {
    return firstValueFrom(
      this.projectsClient
        .send(PROJECTS_PATTERNS.DELETE, id)
        .pipe(timeout(5000)),
    );
  }
}
