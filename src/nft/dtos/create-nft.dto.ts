import { Ref } from '@typegoose/typegoose';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Collection } from 'src/collection/schema/collection.schema';
import { BaseModel } from 'src/global/base.model';
import { User } from 'src/user/schemas/user.schema';

export class CreateNftDto extends BaseModel {
  @IsString()
  name: string;

  @IsString()
  media: string;

  @IsEnum(['image', 'video', 'audio'])
  fileType: string;

  @IsOptional()
  description: string;

  @IsOptional()
  creator: Ref<User>;

  @IsOptional()
  collectionNft: Ref<Collection>;

  @IsOptional()
  owner: Ref<User>;

  @IsOptional()
  @IsNumber()
  level: number;

  @IsOptional()
  mint: boolean;

  // @IsOptional()
  // mintCost: number;

  @IsOptional()
  @IsNumber()
  endTime: number;

  @IsOptional()
  @IsString()
  levelName: string;

  @IsOptional()
  @IsString()
  metadata: string;
}
