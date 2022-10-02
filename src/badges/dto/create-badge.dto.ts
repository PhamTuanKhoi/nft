import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBadgeDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  scores: number;
}
