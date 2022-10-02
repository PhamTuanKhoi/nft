import { prop } from '@typegoose/typegoose';
import { Type } from 'class-transformer';
import { BaseModel } from 'src/global/base.model';

export class Mining extends BaseModel {
  @prop({ required: true })
  @Type(() => Number)
  level: number;

  @prop({ required: true })
  @Type(() => Number)
  price: number;

  @prop({ required: true })
  @Type(() => Number)
  multiplier: number;

  @prop({ required: true })
  @Type(() => Number)
  miningTime: number;

  @prop()
  levelName: string;
}
