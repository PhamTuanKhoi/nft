import { Category } from './../../category/schema/category.schema';
import { Ref } from '@typegoose/typegoose';
import { IsOptional } from 'class-validator';
import { BaseModel } from 'src/global/base.model';
import { NFT } from 'src/nft/schema/nft.schema';
import { User } from 'src/user/schemas/user.schema';

export class CreateCollectionDto extends BaseModel {
  @IsOptional()
  name: string;

  @IsOptional()
  symbol: string;

  @IsOptional()
  image: string;

  @IsOptional()
  creator: Ref<User>;

  @IsOptional()
  nfts: Ref<NFT>[];
}
