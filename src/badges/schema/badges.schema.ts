import { prop, Ref } from '@typegoose/typegoose';
import { BaseModel } from 'src/global/base.model';
import { User } from 'src/user/schemas/user.schema';

export class Badges extends BaseModel {
  @prop()
  name: string;

  @prop()
  image: string;

  @prop()
  description: string;

  @prop()
  scores: number;

  // @prop({ ref: () => User, required: true })
  // owner: Ref<User>;
}
