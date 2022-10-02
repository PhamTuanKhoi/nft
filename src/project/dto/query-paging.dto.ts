import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/global/interfaces/paginate.interface';

export class QueryProjectDto extends PaginationInput {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  status: number;

  @IsOptional()
  @IsString()
  problem: string;
}
