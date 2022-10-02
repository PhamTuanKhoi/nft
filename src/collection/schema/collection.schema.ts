import { Category } from './../../category/schema/category.schema';
import { prop, Ref } from '@typegoose/typegoose';
import { NFT } from 'src/nft/schema/nft.schema';
import { User } from 'src/user/schemas/user.schema';
import { BaseModel } from 'src/global/base.model';

export class Collection extends BaseModel {
  @prop({ required: true })
  name: string;

  @prop()
  symbol: string;

  @prop()
  image: string;

  @prop()
  banner: string;

  // @prop({ ref: () => Category })
  // category: Ref<Category>;

  @prop({ ref: () => NFT })
  nfts: Ref<NFT>[];

  @prop({ ref: () => User })
  creator: Ref<User>;

  @prop({ ref: () => User, default: [] })
  likes: Ref<User>[];
}
