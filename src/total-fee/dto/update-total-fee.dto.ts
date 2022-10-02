import { PartialType } from '@nestjs/swagger';
import { CreateTotalFeeDto } from './create-total-fee.dto';

export class UpdateTotalFeeDto extends PartialType(CreateTotalFeeDto) {}
