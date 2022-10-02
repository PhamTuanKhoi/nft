import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from 'src/global/base.model';

export class CreateMiningDto extends BaseModel {
  @IsNumber()
  level: number;

  @IsNumber()
  price: number;

  @IsNumber()
  multiplier: number;

  @IsNumber()
  miningTime: number;

  @IsOptional()
  @IsString()
  levelName: string;
}
