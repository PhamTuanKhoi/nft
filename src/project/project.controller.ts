import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-paging.dto';
import { ID } from 'src/global/interfaces/id.interface';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/likeProject/:id/:idNft')
  async likeProject(@Param('id') id: string, @Param('idNft') idNft: string) {
    return await this.projectService.LikeProjects(id, idNft);
  }
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Get('paging')
  async get(@Query() query: QueryProjectDto) {
    return await this.projectService.get(query);
  }

  @Get('mined')
  async mined() {
    return await this.projectService.mined();
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get('mine-value/:id')
  async mineValue(@Param('id') id: string) {
    return await this.projectService.mineValue(id);
  }

  @Get('viewer/:id')
  async viewer(@Param('id') id: ID) {
    return this.projectService.viewer(id);
  }

  @Get('detail/:id')
  detail(@Param('id') id: string) {
    return this.projectService.detail(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Patch('vote/:id')
  vote(
    @Param('id') id: string,
    @Body() payload: { power: number; user: string },
  ) {
    return this.projectService.vote(id, payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
