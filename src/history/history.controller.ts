import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ID } from 'src/global/interfaces/id.interface';
import { CreateHistoryDto } from './dtos/create-history.dto';
import { QueryHistoryDto } from './dtos/query-history.dto';
import { UpdateHistoryDto } from './dtos/update-history.dto';
import { HistoryService } from './history.service';

// PATH: v1/histories
@ApiTags('HISTORY')
@Controller('histories')
export class HistoryController {
  constructor(private readonly service: HistoryService) {}

  // GET: /v1/histories/
  // get all histories
  @Get()
  async get(@Query() query: QueryHistoryDto) {
    return await this.service.get(query);
  }

  // GET: /v1/histories/:id
  // get histories by id
  @Get(':id')
  async getById(@Param('id') id: ID) {
    return await this.service.getById(id);
  }

  // POST: /v1/histories/
  // create histories
  @Post()
  async create(@Body() history: CreateHistoryDto) {
    return this.service.create(history);
  }
  // PATCH: /v1/histories/:id
  // update histories by id
  @Patch(':id')
  async update(@Param('id') id: ID, @Body() history: UpdateHistoryDto) {
    return this.service.update(id, history);
  }
  // PATCH: /v1/histories/:id
  // update histories by id
  @Delete(':id')
  async delete(@Param('id') id: ID) {
    return this.service.delete(id);
  }
}
