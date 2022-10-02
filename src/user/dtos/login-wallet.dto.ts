import { IsNotEmpty } from 'class-validator';

export class LoginWalletDto {
  @IsNotEmpty()
  address: string;
}
