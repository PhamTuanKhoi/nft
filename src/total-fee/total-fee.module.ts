import { Module } from '@nestjs/common';
import { TotalFeeService } from './total-fee.service';
import { TotalFeeController } from './total-fee.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { TotalFee } from './schema/total-fee.schema';

@Module({
  imports: [TypegooseModule.forFeature([TotalFee])],
  controllers: [TotalFeeController],
  providers: [TotalFeeService],
  exports: [TotalFeeService],
})
export class TotalFeeModule {}
