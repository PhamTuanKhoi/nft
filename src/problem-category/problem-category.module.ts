import { Module } from '@nestjs/common';
import { ProblemCategoryService } from './problem-category.service';
import { ProblemCategoryController } from './problem-category.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProblemCategory } from './schema/problem-category.schema';

@Module({
  imports: [TypegooseModule.forFeature([ProblemCategory])],
  controllers: [ProblemCategoryController],
  providers: [ProblemCategoryService],
  exports: [ProblemCategoryService]
})
export class ProblemCategoryModule {}
