import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { History } from './schema/history.schema';

@Module({
  imports: [TypegooseModule.forFeature([History])],
  controllers: [HistoryController],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
