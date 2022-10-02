import { PartialType } from '@nestjs/swagger';
import { CreateProblemCategoryDto } from './create-problem-category.dto';

export class UpdateProblemCategoryDto extends PartialType(CreateProblemCategoryDto) {}
