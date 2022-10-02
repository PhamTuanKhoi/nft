import { prop } from '@typegoose/typegoose';
import { BaseModel } from 'src/global/base.model';

export class TotalFee extends BaseModel {
  @prop({ default: 0 })
  gas: number;

  @prop({ default: 0 })
  corecave: number;

  @prop({ default: 0 })
  cause: number;
}
