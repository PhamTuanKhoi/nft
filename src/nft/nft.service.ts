import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { prop, ReturnModelType } from '@typegoose/typegoose';
import { CronJob } from 'cron';
import { InjectModel } from 'nestjs-typegoose';
import schedule from 'node-schedule';
import { CollectionService } from 'src/collection/collection.service';
import { ID } from 'src/global/interfaces/id.interface';
import { PaginateResponse } from 'src/global/interfaces/paginate.interface';
import { MiningService } from 'src/mining/mining.service';
import { CreateNftDto } from './dtos/create-nft.dto';
import { QueryNftDto } from './dtos/query-nft.dto';
import { UpdateNftDto } from './dtos/update-nft-dto';
import { NFT } from './schema/nft.schema';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);
  constructor(
    @InjectModel(NFT) private readonly model: ReturnModelType<typeof NFT>,
    @Inject(forwardRef(() => MiningService))
    private readonly miningService: MiningService,
    @Inject(forwardRef(() => CollectionService))
    private readonly collectionService: CollectionService,
  ) {}

  get = async (query: QueryNftDto): Promise<PaginateResponse<NFT>> => {
    let tmp: any = [
      {
        $lookup: {
          from: 'users',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $lookup: {
          from: 'collections',
          localField: 'collectionNft',
          foreignField: '_id',
          as: 'collectionNft',
        },
      },
      {
        $unwind: '$collectionNft',
      },
      {
        $lookup: {
          from: 'minings',
          let: {
            levelNft: '$level',
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$level', '$$levelNft'] },
              },
            },
          ],
          as: 'mining',
        },
      },
      {
        $unwind: '$mining',
      },
    ];
    if (query.level) {
      tmp = [
        ...tmp,
        {
          $match: {
            level: query.level,
          },
        },
      ];
    }

    if (query.collectionid) {
      tmp = [
        ...tmp,
        {
          $match: {
            $expr: {
              $eq: ['$collectionNft._id', { $toObjectId: query.collectionid }],
            },
          },
        },
      ];
    }
    if (query.search !== undefined && query.search.length > 0) {
      tmp = [
        ...tmp,
        {
          $match: {
            name: { $regex: '.*' + query.search + '.*', $options: 'i' },
          },
        },
      ];
    }
    if (query.fileType !== undefined && query.fileType.length > 0) {
      tmp = [
        ...tmp,
        {
          $match: {
            fileType: query.fileType,
          },
        },
      ];
    }

    if (query.status && query.status !== undefined) {
      let status = JSON.parse(query.status);
      let or: any = [];
      if (status.mine === true) {
        // endTime <= Date.now() && level < 6
        or = [
          ...or,
          {
            endTime: { $lte: Date.now() },
            mint: false,
          },
        ];
      }
      if (status.mining === true) {
        // endTime >= Date.now() && level < 6
        or = [
          ...or,
          {
            endTime: { $gte: Date.now() },
            mint: false,
          },
        ];
      }
      if (status.mined === true) {
        // endTime >= Date.now() && level < 6
        or = [
          ...or,
          {
            mint: true,
          },
        ];
      }
      if (or.length > 0) {
        tmp = [
          ...tmp,
          {
            $match: {
              $or: or,
            },
          },
        ];
      }
    }

    if (query.collection && query.collection !== undefined) {
      let collection = JSON.parse(query.collection);
      let or = collection.map((item) => {
        return {
          $eq: ['$collectionNft._id', { $toObjectId: item }],
        };
      });

      // console.log(or);
      if (or.length > 0) {
        tmp = [
          ...tmp,
          {
            $match: {
              $expr: { $or: or },
            },
          },
        ];
      }
    }
    if (query.levels && query.levels !== undefined) {
      // string to []
      let levels = JSON.parse(query.levels);
      let or = levels.map((item) => {
        return {
          level: item,
        };
      });
      if (or?.length > 0) {
        tmp = [
          ...tmp,
          {
            $match: {
              $or: or,
            },
          },
        ];
      }
    }

    if (query.imported) {
      tmp = [
        {
          $match: {
            imported: query.imported,
          },
        },
        ...tmp,
      ];
    }
    if (
      query.sortBy !== undefined &&
      query.sortBy.length > 0 &&
      query.sortType
    ) {
      tmp = [
        ...tmp,
        {
          $sort: {
            [query.sortBy]: query.sortType,
          },
        },
      ];
    } else {
      tmp = [
        ...tmp,
        {
          $sort: {
            createdAt: -1,
          },
        },
      ];
    }
    let findQuery = this.model.aggregate(tmp);
    const count = (await findQuery.exec()).length;
    if (
      query.limit !== undefined &&
      query.page !== undefined &&
      query.limit > 0 &&
      query.page > 0
    ) {
      findQuery = findQuery
        .limit(query.limit * query.page || 1)
        .skip((query.page - 1) * query.limit);
    }
    const result = await findQuery.exec();
    return {
      items: result,
      paginate: {
        count: count || 0,
        limit: query.limit || 0,
        page: query.page || 0,
      },
    };
  };

  // getAll = async (): Promise<any> => {
  //   return this.model
  //     .find()
  //     .populate('creator')
  //     .populate('owner')
  //     .populate('collectionNft');
  // };
  async getAll() {
    try {
      return await this.model.aggregate([
        {
          $match: {
            imported: true,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator',
          },
        },
        {
          $unwind: '$creator',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'owner',
            foreignField: '_id',
            as: 'owner',
          },
        },
        {
          $unwind: '$owner',
        },
        {
          $lookup: {
            from: 'collections',
            localField: 'collectionNft',
            foreignField: '_id',
            as: 'collectionNft',
          },
        },
        {
          $unwind: '$collectionNft',
        },
        {
          $lookup: {
            from: 'minings',
            let: {
              levelNft: '$level',
            },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$level', '$$levelNft'] },
                },
              },
            ],
            as: 'mining',
          },
        },
        {
          $unwind: '$mining',
        },
      ]);
    } catch (error) {
      console.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async findOne(id: string) {
    try {
      return this.model.findById(id).lean();
    } catch (error) {
      console.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }
  getById = async (id: ID): Promise<NFT> => {
    return this.model
      .findById(id)
      .populate('creator')
      .populate('owner')
      .populate('collectionNft');
  };

  create = async (nft: CreateNftDto): Promise<NFT> => {
    try {
      let id = Date.now();
      const data = await this.model.create({ ...nft, nftId: id });
      this.logger.log(`created a new nft by id#${data?._id}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  async likes(idNft, userId) {
    try {
      const nft = await this.model.findById(idNft);

      if (!nft) {
        throw new HttpException(
          'not found nft have id ' + idNft,
          HttpStatus.BAD_REQUEST,
        );
      }
      let likes = nft?.likes || [];
      if (likes.includes(userId)) {
        const unLike = await this.model.findByIdAndUpdate(
          idNft,
          {
            likes: likes.filter(
              (item) => item.toString() !== userId.toString(),
            ),
          },
          { new: true },
        );
        this.logger.log(`unLike nft by id#${unLike?._id}`);
        return unLike;
      } else {
        const like = await this.model.findByIdAndUpdate(
          idNft,
          {
            likes: [...likes, userId],
          },
          { new: true },
        );
        this.logger.log(`like nft by id#${like?._id}`);
        return like;
      }
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async viewer(id: ID) {
    try {
      let view = 0;
      const isNft = await this.getById(id);
      if (!isNft) {
        throw new HttpException('Nft not fount !', HttpStatus.BAD_REQUEST);
      }
      if (isNft) {
        view = isNft.viewer + 1;
      }
      const updatedViewer = await this.model.findByIdAndUpdate(id, {
        viewer: view,
      });
      return updatedViewer;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async verify(id: string, verify) {
    try {
      const isVerified = await this.model.findByIdAndUpdate(id, verify, {
        new: true,
      });
      return isVerified;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  update = async (id: ID, nft: UpdateNftDto): Promise<NFT> => {
    try {
      const updatedNft = await this.model
        .findByIdAndUpdate(id, nft, { new: true })
        .populate('creator')
        .populate('owner')
        .populate('collectionNft');
      this.logger.log(`updated a nft by id#${updatedNft?._id}`);
      return updatedNft;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  };

  updateTotalPrice = async (id: ID, nft: UpdateNftDto) => {
    try {
      //get date
      let date = new Date(nft.endTime);

      this.logger.warn(
        date.getSeconds(),
        date.getMinutes(),
        date.getHours(),
        date.getDate(),
        date.getMonth(),
        date.getFullYear(),
      );

      const job = new CronJob(date, async () => {
        let priced = 0;
        const isNft = await this.getById(id);

        if (!isNft) {
          throw new HttpException('Nft not fount !', HttpStatus.BAD_REQUEST);
        }

        const Mining = await this.miningService.getByLevel(nft.level);

        if (!Mining) {
          throw new HttpException('Mining not fount !', HttpStatus.BAD_REQUEST);
        }

        if (Mining) {
          priced = Mining.price;
          nft.price = Mining.price;
        }

        if (isNft) {
          nft.total = isNft.price + priced;
        }

        const updatedNft = await this.model
          .findByIdAndUpdate(
            id,
            { ...nft, level: nft.level >= 6 ? 6 : nft.level },
            { new: true },
          )
          .populate('creator')
          .populate('owner')
          .populate('collectionNft');

        this.logger.log(`updated total price a nft by id#${updatedNft?._id}`);
        return updatedNft;
      });
      //start job
      job.start();

      const updateEnTime = await this.model.findByIdAndUpdate(
        id,
        { endTime: nft.endTime, owner: nft.owner },
        { new: true },
      );
      this.logger.log(`updated edtime a nft by id#${updateEnTime?._id}`);
      return updateEnTime;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  };

  delete = async (id: ID, coll: string): Promise<NFT> => {
    const idNft = await this.model.findById(id);
    if (idNft.level > 1) {
      throw new HttpException(
        "Can't not delete NFT great than 1",
        HttpStatus.BAD_REQUEST,
      );
    }

    // un nft coll
    await this.collectionService.unNft(coll, id.toString());
    return await this.model.findByIdAndDelete(id);
  };
}
