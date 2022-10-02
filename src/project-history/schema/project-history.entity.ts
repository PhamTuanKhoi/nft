import { prop, Ref } from '@typegoose/typegoose';
import { BaseModel } from 'src/global/base.model';
import { Project } from 'src/project/schema/project.schema';
import { User } from 'src/user/schemas/user.schema';

export class ProjectHistory extends BaseModel {
  @prop()
  datelike: number;

  @prop()
  date: number;

  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ ref: () => Project })
  project: Ref<Project>;

  @prop()
  power: number;

  @prop({ ref: () => User })
  userLove: Ref<User>;

  @prop({ ref: () => Project })
  projectLove: Ref<Project>;
}
