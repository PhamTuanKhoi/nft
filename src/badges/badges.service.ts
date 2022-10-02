import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { UserService } from 'src/user/user.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { QueryBadesDto } from './dto/query-badges.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Badges } from './schema/badges.schema';

@Injectable()
export class BadgesService {
  private readonly logger = new Logger(BadgesService.name);
  constructor(
    @InjectModel(Badges)
    private readonly model: ReturnModelType<typeof Badges>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async create(createBadgeDto: CreateBadgeDto) {
    try {
      // await this.userService.isModelExist(createBadgeDto.owner)
      const createdBages = await this.model.create(createBadgeDto);
      this.logger.log(`created a new badges by id#${createdBages?._id}`);
      return createdBages;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async findAll(query: QueryBadesDto) {
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
        {
          $lookup: {
            from: 'winers',
            localField: '_id',
            foreignField: 'badges',
            as: 'win',
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

  findOne(id: string) {
    try {
      return this.model.findById(id);
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async findScores(power: number) {
    try {
      return await this.model.find({ scores: { $lte: power } });
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async isModelExist(id, isOptional = false, msg = '') {
    if (isOptional && !id) return;
    const errorMessage = msg || `id-> ${Badges.name} not found`;
    const isExist = await this.findOne(id);
    if (!isExist) throw new Error(errorMessage);
  }

  async update(id: string, updateBadgeDto: UpdateBadgeDto) {
    try {
      // await this.userService.isModelExist(updateBadgeDto.owner);
      const updated = await this.model.findByIdAndUpdate(id, updateBadgeDto, {
        new: true,
      });
      this.logger.log(`updated badges by id#${updated._id}`);
      return updated;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string) {
    try {
      const removed = await this.model.findByIdAndDelete(id);
      this.logger.log(`removed badges by id#${removed._id}`);
      return removed;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }
}
