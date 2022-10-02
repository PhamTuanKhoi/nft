import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ProjectStatusEnum } from '../schema/project.schema';

export class CreateProjectDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  problemCategory: string;

  @IsOptional()
  @IsNumber()
  mintCost: number;

  @IsOptional()
  @IsNumber()
  endTime: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(ProjectStatusEnum)
  status: ProjectStatusEnum;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  value: string;

  @IsOptional()
  power: number;

  //   @IsNotEmpty()
  //   @IsString()
  //   likes: string;

  // followers: Array<T>;

  // viewers: Array;
  @IsNotEmpty()
  @IsOptional()
  creator: string;
}
