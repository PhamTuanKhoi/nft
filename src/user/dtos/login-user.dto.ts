import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @Length(4, 30)
  password: string;
}
