import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateProblemCategoryDto } from './dto/create-problem-category.dto';
import { QueryProblemCategoryDto } from './dto/query-problem-category.dto';
import { UpdateProblemCategoryDto } from './dto/update-problem-category.dto';
import { ProblemCategory } from './schema/problem-category.schema';

@Injectable()
export class ProblemCategoryService {
  private readonly logger = new Logger(ProblemCategoryService.name);
  constructor(
    @InjectModel(ProblemCategory)
    private readonly model: ReturnModelType<typeof ProblemCategory>,
  ) {}
  async create(
    createProblemCategoryDto: CreateProblemCategoryDto,
  ): Promise<ProblemCategory> {
    try {
      const createdProblemCategory = await this.model.create(
        createProblemCategoryDto,
      );
      this.logger.log(
        `created a new ProblemCategory by id#${createdProblemCategory?._id}`,
      );
      return createdProblemCategory;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async isModelExist(id, isOptional = false, msg = '') {
    if (isOptional && !id) return;
    const errorMessage = msg || `id-> ${ProblemCategory.name} not found`;
    const isExist = await this.findOne(id);
    if (!isExist) throw new Error(errorMessage);
  }

  async get(query: QueryProblemCategoryDto) {
    const { page, limit, sortType, sortBy, ...filterQuery } = query;
    const skip = (+page - 1) * +limit;

    try {
      let pipeline: any = [
        {
          $match: {
            name: {
              $regex: filterQuery?.search || '',
              $options: 'i',
            },
          },
        },
      ];

      if (sortBy && sortType) {
        pipeline.push({
          $sort: {
            [sortBy]: sortType == '-1' ? -1 : 1,
          },
        });
      }
      // const [data, count] = await Promise.all([
      //   this.model.aggregate([
      //     ...pipeline,
      //     { $skip: skip < 0 ? 0 : skip },
      //     { $limit: +limit },
      //   ]),
      //   this.model.aggregate([...pipeline, { $count: 'count' }]),
      // ]);
      if (page && limit) {
        let skip = (+page - 1) * +limit;
        pipeline.push({ $skip: skip < 0 ? 0 : skip }, { $limit: +limit });
      }

      const data = await this.model.aggregate([...pipeline]);
      const count = await this.model.aggregate([{ $count: 'count' }]);

      return {
        items: data,
        paginate: {
          page,
          count: count.length > 0 ? count[0].count : 0,
          size: limit,
        },
      };
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }
  findAll() {
    try {
      return this.model.find();
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  findOne(id: string) {
    try {
      return this.model.findById(id);
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async update(
    id: string,
    updateProblemCategoryDto: UpdateProblemCategoryDto,
  ): Promise<ProblemCategory> {
    try {
      const updated = await this.model.findByIdAndUpdate(
        id,
        updateProblemCategoryDto,
        { new: true },
      );
      this.logger.log(`updated problemCategory by id#${updated._id}`);
      return updated;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string): Promise<ProblemCategory> {
    try {
      const removed = await this.model.findByIdAndDelete(id);
      this.logger.log(`removed problemCategory by id#${removed._id}`);
      return removed;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }
}
