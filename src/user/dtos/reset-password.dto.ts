import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { ID } from '../../global/interfaces/id.interface';

export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsMongoId()
  userId: ID;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Length(4, 30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Length(4, 30)
  confirmPassword: string;
}
