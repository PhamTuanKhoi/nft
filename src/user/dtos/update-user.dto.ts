import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { RegisterUserDto } from './register-user.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  emailOld: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  cover: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  avatar: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Length(2, 100)
  username: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  @Length(4, 30)
  password: string;

  @IsOptional()
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

  @IsOptional()
  @IsString()
  squadName: string;

  @IsOptional()
  @IsString()
  squadImage: string;
}
