import { PartialType } from '@nestjs/swagger';
import { CreateProjectHistoryDto } from './create-project-history.dto';

export class UpdateProjectHistoryDto extends PartialType(CreateProjectHistoryDto) {}
