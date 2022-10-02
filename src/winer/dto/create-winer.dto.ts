import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWinerDto {
  @IsNotEmpty()
  @IsString()
  user: string;

  // @IsNotEmpty()
  // @IsString()
  // badges: string;
}
