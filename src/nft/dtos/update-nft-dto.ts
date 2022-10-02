import { BaseModel } from 'src/global/base.model';
import { CreateNftDto } from './create-nft.dto';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Ref } from '@typegoose/typegoose';
import { User } from 'src/user/schemas/user.schema';
import { Collection } from 'src/collection/schema/collection.schema';
import { Type } from 'class-transformer';

export class UpdateNftDto extends BaseModel {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  media: string;

  @IsOptional()
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
  mintCost: number;

  @IsOptional()
  @IsNumber()
  level: number;

  @IsOptional()
  @Type(() => Boolean)
  mint: boolean;

  @IsOptional()
  @IsNumber()
  endTime: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsBoolean()
  imported: boolean;
}
