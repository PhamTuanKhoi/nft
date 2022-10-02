import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { MiningController } from './mining.controller';
import { MiningService } from './mining.service';
import { Mining } from './schema/mining.schema';

@Module({
  imports: [TypegooseModule.forFeature([Mining])],
  controllers: [MiningController],
  providers: [MiningService],
  exports: [MiningService],
})
export class MiningModule {}
