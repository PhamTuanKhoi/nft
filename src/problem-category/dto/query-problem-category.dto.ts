import { IsOptional, IsString } from "class-validator";
import { PaginationInput } from "src/global/interfaces/paginate.interface";

export class QueryProblemCategoryDto extends PaginationInput {
    @IsOptional()
    @IsString()
    search: string;
}
