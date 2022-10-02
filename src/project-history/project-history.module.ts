import { Module } from '@nestjs/common';
import { ProjectHistoryService } from './project-history.service';
import { ProjectHistoryController } from './project-history.controller';
import { ProjectHistory } from './schema/project-history.entity';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [TypegooseModule.forFeature([ProjectHistory])],
  controllers: [ProjectHistoryController],
  providers: [ProjectHistoryService],
  exports: [ProjectHistoryService],
})
export class ProjectHistoryModule {}
