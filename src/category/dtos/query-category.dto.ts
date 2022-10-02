import { IsOptional } from 'class-validator';
import { QueryDto } from 'src/global/dtos/query.dto';

export class QueryCategoryDto extends QueryDto {
  @IsOptional()
  id: string;

  @IsOptional()
  collectionId: string;
}
