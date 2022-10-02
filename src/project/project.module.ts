import { Module, forwardRef } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Project } from './schema/project.schema';
import { ProblemCategoryModule } from 'src/problem-category/problem-category.module';
import { UserService } from 'src/user/user.service';
import { ProjectHistoryModule } from 'src/project-history/project-history.module';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
    TypegooseModule.forFeature([Project]),
    forwardRef(() => ProblemCategoryModule),
    forwardRef(() => ProjectHistoryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
