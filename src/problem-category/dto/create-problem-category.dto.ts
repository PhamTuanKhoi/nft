import { IsOptional, IsString } from "class-validator";

export class CreateProblemCategoryDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    image: string;

    @IsOptional()
    @IsString()
    description: string;
}
