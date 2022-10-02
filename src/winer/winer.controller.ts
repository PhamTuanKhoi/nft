import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WinerService } from './winer.service';
import { CreateWinerDto } from './dto/create-winer.dto';
import { UpdateWinerDto } from './dto/update-winer.dto';

@Controller('winers')
export class WinerController {
  constructor(private readonly winerService: WinerService) {}

  @Post()
  create(@Body() createWinerDto: CreateWinerDto) {
    return this.winerService.create(createWinerDto);
  }

  @Get()
  findAll() {
    return this.winerService.findAll();
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.winerService.findByUser(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.winerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWinerDto: UpdateWinerDto) {
    return this.winerService.update(+id, updateWinerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.winerService.remove(+id);
  }
}
