import { Controller } from '@nestjs/common';
import { ProjectsService } from './projects-rmq.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PROJECTS_PATTERNS } from '@app/common/patterns/projects';
import { CreateProjectDto, UpdateProjectDto } from '@app/common/dto/projects';
import { RmqBaseController } from '@app/common/rmq';

@Controller()
export class ProjectsRmqController extends RmqBaseController {
  constructor(private readonly projectsService: ProjectsService) {
    super();
  }

  @MessagePattern(PROJECTS_PATTERNS.CREATE)
  async create(@Payload() dto: CreateProjectDto, @Ctx() context: RmqContext) {
    const result = await this.projectsService.create(dto);

    this.acknowledgeMessage(context);

    return result;
  }

  @MessagePattern(PROJECTS_PATTERNS.FIND_ALL)
  async findAll(@Ctx() context: RmqContext) {
    const result = await this.projectsService.findAll();

    this.acknowledgeMessage(context);

    return result;
  }

  @MessagePattern(PROJECTS_PATTERNS.FIND_ONE)
  async findOne(@Payload() id: string, @Ctx() context: RmqContext) {
    const result = await this.projectsService.findOne(id);

    this.acknowledgeMessage(context);

    return result;
  }

  @MessagePattern(PROJECTS_PATTERNS.UPDATE)
  async update(@Payload() dto: UpdateProjectDto, @Ctx() context: RmqContext) {
    const result = await this.projectsService.update(dto);

    this.acknowledgeMessage(context);

    return result;
  }

  @MessagePattern(PROJECTS_PATTERNS.DELETE)
  async delete(@Payload() id: string, @Ctx() context: RmqContext) {
    const result = await this.projectsService.softDelete(id);

    this.acknowledgeMessage(context);

    return result;
  }
}
