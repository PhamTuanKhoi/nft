import { prop, Ref } from '@typegoose/typegoose';
import { Type } from 'class-transformer';
import { BaseModel } from 'src/global/base.model';
import { User } from 'src/user/schemas/user.schema';

export enum CategoryNameEnum {
  Art = 'Art',
  Music = 'Music',
  Collectibles = 'Collectibles',
  Sports = 'Sports',
}
export class Category extends BaseModel {
  @prop()
  title: CategoryNameEnum;

  @prop()
  image: string;

  @prop()
  description: string;

  @prop({ ref: () => User, default: [] })
  likes: Ref<User>[];
}
