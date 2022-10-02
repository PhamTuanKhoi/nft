import { prop, Ref } from '@typegoose/typegoose';
import { Exclude } from 'class-transformer';
import { BaseModel } from '../../global/base.model';
import { UserRoleEnum } from '../interfaces/userRole.enum';
import { UserStatusEnum } from '../interfaces/userStatus.enum';

export class User extends BaseModel {
  @prop()
  cover: string;

  @prop()
  avatar: string;

  @prop()
  username: string;

  @prop()
  @Exclude()
  password: string;

  @prop()
  email: string;

  @prop()
  emailOld: string;

  @prop()
  title: string;

  @prop({ default: 'Unnamed' })
  displayName: string;

  @prop()
  nonce: string;

  @prop()
  address: string;

  @prop()
  bio: string;

  @prop()
  customUrl: string;

  @prop()
  facebook: string;

  @prop()
  twitter: string;

  @prop()
  discord: string;

  @prop({ ref: () => User })
  followeds: Ref<User>[];

  @prop({ ref: () => User })
  followers: Ref<User>[];

  @prop({ default: false })
  verified: false;

  @prop({ default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @prop({ default: false })
  feature: boolean;

  @prop({ default: [] })
  like: Ref<User>[];

  @prop({ default: 0 })
  power: number;

  @prop()
  squadName: string;

  @prop()
  squadImage: string;
}
