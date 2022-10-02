import { IsOptional, IsString } from 'class-validator';
import { QueryDto } from 'src/global/dtos/query.dto';

export class QueryHistoryDto extends QueryDto {
  @IsOptional()
  @IsString()
  nft: string;

  @IsOptional()
  @IsString()
  name: string;
}
