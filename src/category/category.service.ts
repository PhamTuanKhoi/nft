import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ID } from 'src/global/interfaces/id.interface';
import { PaginateResponse } from 'src/global/interfaces/paginate.interface';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { QueryCategoryDto } from './dtos/query-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    @InjectModel(Category)
    private readonly model: ReturnModelType<typeof Category>,
  ) {}

  get = async (
    query: QueryCategoryDto,
  ): Promise<PaginateResponse<Category>> => {
    let tmp = [];
    if (query.search !== undefined && query.search.length > 0) {
      tmp = [
        ...tmp,
        {
          $match: {
            title: { $regex: '.*' + query.search + '.*', $options: 'i' },
          },
        },
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
        .limit(query.limit)
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

  async mockNft() {
    try {
      return this.model.aggregate([
        {
          $lookup: {
            from: 'collections',
            localField: '_id',
            foreignField: 'category',
            pipeline: [
              {
                $lookup: {
                  from: 'nfts',
                  localField: '_id',
                  foreignField: 'collectionNft',
                  pipeline: [
                    {
                      $match: {
                        imported: true,
                      },
                    },
                  ],
                  as: 'nfts',
                },
              },
              // { $unwind: '$nfts' },
            ],
            as: 'collections',
          },
        },
        {
          $unwind: '$collections',
        },
        {
          $sort: {
            _id: -1,
          },
        },
        {
          $group: {
            _id: {
              id: '$_id',
              name: '$title',
              image: '$image',
              likes: '$likes',
              nfts: '$collections.nfts',
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id.id',
            name: '$_id.name',
            image: '$_id.image',
            likes: '$_id.likes',
            nfts: '$_id.nfts',
          },
        },
      ]);
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async totalPrice() {
    try {
      //price
      const totalPrice = await this.model.aggregate([
        {
          $lookup: {
            from: 'collections',
            localField: '_id',
            foreignField: 'category',
            as: 'collections',
          },
        },
        {
          $unwind: '$collections',
        },
        {
          $lookup: {
            from: 'nfts',
            localField: 'collectionNft',
            foreignField: 'collections._id',
            pipeline: [
              {
                $lookup: {
                  from: 'minings',
                  let: {
                    levelNft: '$level',
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $eq: ['$level', '$$levelNft'] }],
                        },
                      },
                    },
                  ],
                  as: 'mining',
                },
              },
              {
                $unwind: '$mining',
              },
            ],
            as: 'nfts',
          },
        },
        {
          $unwind: '$nfts',
        },
        {
          $group: {
            _id: {
              id: '$_id',
            },
            totalPrice: {
              $sum: '$nfts.mining.price',
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id.id',
            totalPrice: '$totalPrice',
          },
        },
      ]);
      //data
      const result = await this.model.aggregate([
        {
          $group: {
            _id: {
              id: '$_id',
              title: '$title',
              description: '$description',
              image: '$image',
            },
          },
        },
        {
          $project: {
            _id: 0,
            cateId: '$_id.id',
            title: '$_id.title',
            description: '$_id.description',
            image: '$_id.image',
            totalPrice: '',
          },
        },
      ]);

      result.map((item) => {
        totalPrice.map((val) => {
          if (item.cateId.toString() === val.id.toString()) {
            item.totalPrice = val.totalPrice;
          }
        });
      });
      return result;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async mockNftById(query: QueryCategoryDto) {
    try {
      let pipeline: any = [
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: query.id }],
            },
          },
        },
        {
          $lookup: {
            from: 'collections',
            localField: '_id',
            foreignField: 'category',
            pipeline: [
              {
                $lookup: {
                  from: 'nfts',
                  localField: '_id',
                  foreignField: 'collectionNft',
                  pipeline: [
                    {
                      $match: {
                        imported: true,
                      },
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
                              $expr: {
                                $and: [{ $eq: ['$level', '$$levelNft'] }],
                              },
                            },
                          },
                        ],
                        as: 'mining',
                      },
                    },
                    { $unwind: '$mining' },
                  ],
                  as: 'nfts',
                },
              },
              // { $unwind: '$nfts' },
            ],
            as: 'collections',
          },
        },
        {
          $unwind: '$collections',
        },
        {
          $group: {
            _id: {
              id: '$_id',
              name: '$title',
              image: '$image',
              nameSubcollection: '$collections.name',
              imageSubcollection: '$collections.image',
              nfts: '$collections.nfts',
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: '$_id.id',
            name: '$_id.name',
            image: '$_id.image',
            nameSubcollection: '$_id.nameSubcollection',
            imageSubcollection: '$_id.imageSubcollection',
            nfts: '$_id.nfts',
          },
        },
      ];

      if (query.collectionId) {
        pipeline.splice(3, 0, {
          $match: {
            $expr: {
              $eq: ['$collections._id', { $toObjectId: query.collectionId }],
            },
          },
        });
      }
      return this.model.aggregate(pipeline);
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async likes(id, userId) {
    try {
      const categories = await this.model.findById(id);

      if (!categories) {
        throw new HttpException(
          'not found categories have id ' + id,
          HttpStatus.BAD_REQUEST,
        );
      }
      let likes = categories?.likes || [];
      if (likes.includes(userId)) {
        const unLike = await this.model.findByIdAndUpdate(
          id,
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
          id,
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

  getAll = async (): Promise<any> => {
    return this.model.find();
  };

  getById = async (id: ID): Promise<Category> => {
    return this.model.findById(id);
  };

  create = async (nft: CreateCategoryDto): Promise<Category> => {
    return await this.model.create(nft);
  };

  update = async (id: ID, nft: UpdateCategoryDto): Promise<Category> => {
    try {
      const updated = await this.model.findByIdAndUpdate(id, nft, {
        new: true,
      });
      this.logger.log(`created a new category by id#${updated?._id}`);
      return updated;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  };

  delete = async (id: ID): Promise<Category> => {
    return await this.model.findByIdAndDelete(id);
  };
}
