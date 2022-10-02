import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { BadgesService } from 'src/badges/badges.service';
import { UserService } from 'src/user/user.service';
import { CreateWinerDto } from './dto/create-winer.dto';
import { UpdateWinerDto } from './dto/update-winer.dto';
import { Winer } from './schema/winer.schema';

@Injectable()
export class WinerService {
  private readonly logger = new Logger(WinerService.name);

  constructor(
    @InjectModel(Winer)
    private readonly model: ReturnModelType<typeof Winer>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => BadgesService))
    private readonly badgesService: BadgesService,
  ) {}

  async create(createWinerDto: CreateWinerDto) {
    try {
      const isUser = await this.userService.findOwner(createWinerDto.user);
      if (!isUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const isBadges = await this.badgesService.findScores(isUser.power);
      let payload = [];
      let wined = [];
      if (isBadges.length > 0) {
        isBadges.map((item) => {
          this.model
            .find({ badges: item._id, user: createWinerDto.user })
            .then((isWiner) => {
              if (isWiner.length > 0) {
                return false;
              } else {
                this.model
                  .create({
                    user: createWinerDto.user,
                    badges: item._id,
                  })
                  .then((data) => {
                    this.logger.log(`created a new winer by id#${data._id}`);
                    return data;
                  });
              }
            });
        });
      } else {
        this.logger.log(`you not enough power`);
        return true;
      }
      // console.log('bad', isBadges);
      // payload.push({
      //   user: createWinerDto.user,
      //   badges: item._id,
      // });
      // const createdWiner = [];
      // const createdWiner = await this.model.insertMany(payload);
      // this.logger.log(`created a new winer`);
      // console.log(createdWiner);
      // return createdWiner;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  findAll() {
    return `This action returns all winer`;
  }

  async findByUser(id: string) {
    try {
      return await this.model.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$user', { $toObjectId: id }],
            },
          },
        },
        {
          $lookup: {
            from: 'badges',
            localField: 'badges',
            foreignField: '_id',
            as: 'badges',
          },
        },
        {
          $unwind: '$badges',
        },
        { $sort: { 'badges.scores': -1 } },
      ]);
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} winer`;
  }

  update(id: number, updateWinerDto: UpdateWinerDto) {
    return `This action updates a #${id} winer`;
  }

  remove(id: number) {
    return `This action removes a #${id} winer`;
  }
}
