import { IsOptional, IsString } from "class-validator";
import { PaginationInput } from "src/global/interfaces/paginate.interface";

export class QueryBadesDto extends PaginationInput {  
    @IsOptional()
    @IsString()
    search: string;
  }