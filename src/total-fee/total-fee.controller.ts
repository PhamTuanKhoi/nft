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
import { TotalFeeService } from './total-fee.service';
import { CreateTotalFeeDto } from './dto/create-total-fee.dto';
import { UpdateTotalFeeDto } from './dto/update-total-fee.dto';
import { QueryTotalFreeDto } from './dto/query-total-fee.dto';

@Controller('total-fee')
export class TotalFeeController {
  constructor(private readonly totalFeeService: TotalFeeService) {}

  @Get()
  findAll(@Query() query: QueryTotalFreeDto) {
    return this.totalFeeService.findAll(query);
  }

  @Get('list')
  list() {
    return this.totalFeeService.list();
  }

  @Get('gas')
  createAndUpdateGas(@Query() query: { gas: number }) {
    return this.totalFeeService.createAndUpdateGas(query);
  }
}
