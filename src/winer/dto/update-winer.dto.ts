import { PartialType } from '@nestjs/swagger';
import { CreateWinerDto } from './create-winer.dto';

export class UpdateWinerDto extends PartialType(CreateWinerDto) {}
