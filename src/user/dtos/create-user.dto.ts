import { Type } from 'class-transformer';
import { UserRoleEnum } from '../interfaces/userRole.enum';
import { UserStatusEnum } from '../interfaces/userStatus.enum';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  Length,
  IsString,
  IsEmail,
  IsNumber,
} from 'class-validator';
import { BaseModel } from 'src/global/base.model';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  avatar: string;

  @IsOptional()
  @IsEmail()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  @Length(2, 100)
  username: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Length(2, 30)
  displayName: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Length(2, 100)
  address: string;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
