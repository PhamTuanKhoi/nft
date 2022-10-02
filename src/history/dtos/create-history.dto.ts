import { NFT } from 'src/nft/schema/nft.schema';
import { User } from 'src/user/schemas/user.schema';
import { Ref } from '@typegoose/typegoose';
import { IsNumber, IsOptional } from 'class-validator';
import { BaseModel } from 'src/global/base.model';

export class CreateHistoryDto extends BaseModel {
  @IsOptional()
  @IsNumber()
  currentLevel: number;

  // @IsOptional()
  // @IsNumber()
  // mintCost: number;

  @IsOptional()
  user: Ref<User>;

  @IsOptional()
  nft: Ref<NFT>;
}
