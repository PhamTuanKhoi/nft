import { prop, Ref } from '@typegoose/typegoose';
import { Badges } from 'src/badges/schema/badges.schema';
import { BaseModel } from '../../global/base.model';
import { User } from '../../user/schemas/user.schema';
export class Winer extends BaseModel {
  @prop({ ref: () => User, required: true })
  user: Ref<User>;

  @prop({ ref: () => Badges, required: true })
  badges: Ref<Badges>;
}
