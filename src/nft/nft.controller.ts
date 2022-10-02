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
import { ID } from 'src/global/interfaces/id.interface';
import { CreateNftDto } from './dtos/create-nft.dto';
import { QueryNftDto } from './dtos/query-nft.dto';
import { UpdateNftDto } from './dtos/update-nft-dto';
import { NftService } from './nft.service';

// PATH: v1/nfts
@Controller('nfts')
export class NftController {
  constructor(private readonly service: NftService) {}

  // GET: /v1/nfts/all
  // get all nft no query
  @Get('/all/nfts')
  async getAll() {
    return await this.service.getAll();
  }
  // GET: /v1/nfts/
  // get all nft with query
  @Get()
  async get(@Query() query: QueryNftDto) {
    return await this.service.get(query);
  }

  @Get('likes/:id/:userId')
  async likes(@Param('id') id: string, @Param('userId') userId: string) {
    return this.service.likes(id, userId);
  }

  @Get('viewer/:id')
  async viewer(@Param('id') id: ID) {
    return this.service.viewer(id);
  }
  // GET: /v1/nfts/:id
  // get nft by id
  @Get(':id')
  async getById(@Param('id') id: ID) {
    return await this.service.getById(id);
  }
  // POST: /v1/nfts/
  // create nft
  @Post()
  async create(@Body() nft: CreateNftDto) {
    return this.service.create(nft);
  }

  @Patch('verify/:id')
  async verify(@Param('id') id: string, @Body() verify: boolean) {
    return this.service.verify(id, verify);
  }
  // PATCH: /v1/nfts/:id
  // uppdate nft by id
  @Patch('updated/:id')
  async update(@Param('id') id: ID, @Body() nft: UpdateNftDto) {
    return this.service.update(id, nft);
  }
  // PATCH: /v1/nfts/:id
  // uppdate nft by id
  @Patch(':id')
  async updateTotalPrice(@Param('id') id: ID, @Body() nft: UpdateNftDto) {
    return this.service.updateTotalPrice(id, nft);
  }
  // PATCH: /v1/nfts/:id
  // uppdate nft by id
  @Delete(':id/:coll')
  async delete(@Param('id') id: ID, @Param('coll') coll: string) {
    return this.service.delete(id, coll);
  }
}
