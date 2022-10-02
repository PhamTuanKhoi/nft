import { NFT } from 'src/nft/schema/nft.schema';
import { User } from 'src/user/schemas/user.schema';
import { Prop, Ref } from '@typegoose/typegoose';
import { Type } from 'class-transformer';
import { BaseModel } from 'src/global/base.model';

export class History extends BaseModel {
  @Prop({ required: true })
  @Type(() => Number)
  currentLevel: number;

  // @Prop({ required: true })
  // @Type(() => Number)
  // mintCost: number;

  @Prop({ ref: () => User })
  user: Ref<User>;

  @Prop({ ref: () => NFT })
  nft: Ref<NFT>;
}
