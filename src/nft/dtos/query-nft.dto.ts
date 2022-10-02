import { Collection } from 'src/collection/schema/collection.schema';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { QueryDto } from 'src/global/dtos/query.dto';

export class QueryNftDto extends QueryDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  fileType: string;

  @IsOptional()
  @IsString()
  endTime: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  level: Number;

  @IsOptional()
  @IsString()
  collectionid: string;

  @IsOptional()
  status: string;

  @IsOptional()
  collection: string;

  @IsOptional()
  levels: string;

  @IsOptional()
  @Type(() => Boolean)
  imported: boolean;
}
