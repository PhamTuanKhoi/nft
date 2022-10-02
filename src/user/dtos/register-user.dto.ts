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

export class RegisterUserDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  cover: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  avatar: string;

  @IsEmail()
  @Type(() => String)
  email: string;

  @IsString()
  @Type(() => String)
  @Length(2, 100)
  username: string;

  @IsString()
  @Type(() => String)
  @Length(4, 30)
  password: string;

  @IsString()
  @Type(() => String)
  @Length(4, 30)
  confirmPassword: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Length(2, 30)
  displayName: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  bio: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  customUrl: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  facebook: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  twitter: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  discord: string;

  @IsOptional()
  @IsNumber()
  power: number;
}
