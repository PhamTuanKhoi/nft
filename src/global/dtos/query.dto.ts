import { IsEnum, IsNumber, IsString } from 'class-validator';
import { IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsEnum([-1, 1])
  sortType: number;
}
