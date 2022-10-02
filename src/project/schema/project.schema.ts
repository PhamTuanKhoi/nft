import { prop, Ref } from '@typegoose/typegoose';
import { BaseModel } from 'src/global/base.model';
import { ProblemCategory } from 'src/problem-category/schema/problem-category.schema';
import { User } from 'src/user/schemas/user.schema';

export enum ProjectStatusEnum {
  Mining = 0,
  Mined = 1,
  Waiting = 2,
}
export class Project extends BaseModel {
  @prop()
  name: string;

  @prop()
  image: string;

  @prop({ ref: () => ProblemCategory, required: true })
  problemCategory: Ref<ProblemCategory>;

  @prop({ default: 0 })
  mintCost: number;

  @prop({ default: 0 })
  endTime: number;

  @prop()
  description: string;

  @prop({ default: ProjectStatusEnum.Mining })
  status: ProjectStatusEnum;

  @prop()
  address: string;

  @prop({ default: 0 })
  value: string;

  @prop({ default: 0 })
  power: number;

  @prop({ default: [] })
  followers: Ref<User>[];

  @prop({ default: [] })
  viewers: Ref<User>[];

  @prop({ ref: () => User, default: [] })
  likes: Ref<User>[];

  @prop({ ref: () => User, required: true })
  creater: Ref<User>;

  @prop({ default: 0 })
  viewer: number;
}
