import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListNftDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
