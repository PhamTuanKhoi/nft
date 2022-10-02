import { IsOptional } from 'class-validator';

export class CreateProjectHistoryDto {
  @IsOptional()
  datelike: number;

  @IsOptional()
  date: number;

  @IsOptional()
  user: string;

  @IsOptional()
  project: string;

  @IsOptional()
  power: number;

  @IsOptional()
  userLove: string;

  @IsOptional()
  projectLove: string;
}
