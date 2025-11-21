import { PROJECTS_SERVICE } from '@app/common/constants/services';
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
import { firstValueFrom } from 'rxjs';

@Controller('projects')
export class ProjectsController {
  constructor(
    @Inject(PROJECTS_SERVICE) private readonly projectsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return firstValueFrom(
      this.projectsClient.send(PROJECTS_PATTERNS.CREATE, dto),
    );
  }

  @Get()
  findAll() {
    return firstValueFrom(
      this.projectsClient.send(PROJECTS_PATTERNS.FIND_ALL, {}),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.projectsClient.send(PROJECTS_PATTERNS.FIND_ONE, id),
    );
  }

  @Patch('update')
  update(@Body() dto: UpdateProjectDto) {
    const payload = { ...dto };

    return firstValueFrom(
      this.projectsClient.send(PROJECTS_PATTERNS.UPDATE, payload),
    );
  }

  @Delete(':id/remove')
  delete(@Param('id') id: string) {
    return firstValueFrom(
      this.projectsClient.send(PROJECTS_PATTERNS.DELETE, id),
    );
  }
}
