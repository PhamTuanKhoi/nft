import { prop } from '@typegoose/typegoose';
import { BaseModel } from 'src/global/base.model';

export class ProblemCategory extends BaseModel {
  @prop()
  name: string;

  @prop()
  image: string;

  @prop()
  description: string;
}
