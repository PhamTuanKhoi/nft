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
import { CreateMiningDto } from './dtos/create-mining.dto';
import { QueryMiningDto } from './dtos/query-mining.dto';
import { UpdateMiningDto } from './dtos/update-mining.dto';
import { MiningService } from './mining.service';

// PATH: v1/nfts
@ApiTags('MINING')
@Controller('minings')
export class MiningController {
  constructor(private readonly service: MiningService) {}

  @Get('level/:level')
  async getByLevel(@Param('level') level: number) {
    return await this.service.getByLevel(level);
  }
  // GET: /v1/nfts/:id
  // get nft by id
  @Get(':id')
  async getById(@Param('id') id: ID) {
    return await this.service.getById(id);
  }
  // GET: /v1/nfts/
  // get all nft
  @Get()
  async get(@Query() query: QueryMiningDto) {
    return await this.service.get(query);
  }
  // POST: /v1/nfts/
  // create nft
  @Post()
  async create(@Body() nft: CreateMiningDto) {
    return this.service.create(nft);
  }
  // PATCH: /v1/nfts/:id
  // uppdate nft by id
  @Patch(':id')
  async update(@Param('id') id: ID, @Body() nft: UpdateMiningDto) {
    return this.service.update(id, nft);
  }
  // PATCH: /v1/nfts/:id
  // uppdate nft by id
  @Delete(':id')
  async delete(@Param('id') id: ID) {
    return this.service.delete(id);
  }
}
