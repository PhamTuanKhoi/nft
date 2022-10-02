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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { QueryCategoryDto } from './dtos/query-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

// PATH: v1/histories
@ApiTags('CATEGORY')
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async get(@Query() query: QueryCategoryDto) {
    return await this.service.get(query);
  }

  @Get('nft')
  async mockNft() {
    return await this.service.mockNft();
  }

  @Get('price')
  async totalPrice() {
    return await this.service.totalPrice();
  }

  @Get('nft/mining')
  async mockNftById(@Query() query: QueryCategoryDto) {
    return await this.service.mockNftById(query);
  }

  @Get('likes/:id/:userId')
  async likes(@Param('id') id: string, @Param('userId') userId: string) {
    return this.service.likes(id, userId);
  }

  @Get(':id')
  async getById(@Param('id') id: ID) {
    return await this.service.getById(id);
  }

  @Post()
  async create(@Body() category: CreateCategoryDto) {
    return this.service.create(category);
  }

  @Patch(':id')
  async update(@Param('id') id: ID, @Body() category: UpdateCategoryDto) {
    return this.service.update(id, category);
  }

  @Delete(':id')
  async delete(@Param('id') id: ID) {
    return this.service.delete(id);
  }
}
