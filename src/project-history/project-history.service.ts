import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProjectHistoryDto } from './dto/create-project-history.dto';
import { UpdateProjectHistoryDto } from './dto/update-project-history.dto';
import { ProjectHistory } from './schema/project-history.entity';

@Injectable()
export class ProjectHistoryService {
  private readonly logger = new Logger(ProjectHistoryService.name);
  constructor(
    @InjectModel(ProjectHistory)
    private readonly model: ReturnModelType<typeof ProjectHistory>,
  ) {}
  async powerHistory(updateProjectHistoryDto: UpdateProjectHistoryDto) {
    try {
      const data = await this.model.create(updateProjectHistoryDto);
      this.logger.log('Project history created success', data?._id);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async unLikeHistory(userLove: string, projectLove: string) {
    try {
      const data = await this.model.findOne({ userLove, projectLove }).lean();
      return this.model.findByIdAndRemove(data?._id);
    } catch (error) {
      console.log(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.model.findById(id).lean();
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(user: string, project: string) {
    try {
      return await this.model.findOne({ user, project });
    } catch (error) {
      console.log(error);
    }
  }

  create(createProjectHistoryDto: CreateProjectHistoryDto) {
    return 'This action adds a new projectHistory';
  }

  findAll() {
    return `This action returns all projectHistory`;
  }

  update(id: number, updateProjectHistoryDto: UpdateProjectHistoryDto) {
    return `This action updates a #${id} projectHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} projectHistory`;
  }
}
