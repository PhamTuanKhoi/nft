import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ID } from 'src/global/interfaces/id.interface';
import { PaginateResponse } from 'src/global/interfaces/paginate.interface';
import { CreateMiningDto } from './dtos/create-mining.dto';
import { QueryMiningDto } from './dtos/query-mining.dto';
import { UpdateMiningDto } from './dtos/update-mining.dto';
import { Mining } from './schema/mining.schema';

@Injectable()
export class MiningService {
  constructor(
    @InjectModel(Mining) private readonly model: ReturnModelType<typeof Mining>,
  ) {}

  get = async (query: QueryMiningDto): Promise<PaginateResponse<Mining>> => {
    let tmp = [];
    if (query.search !== undefined && query.search.length > 0) {
      tmp = [
        ...tmp,
        {
          $match: {
            levelName: { $regex: '.*' + query.search + '.*', $options: 'i' },
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
            level: 1,
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
        .skip((query.page - 1) * query.limit)
        .limit(query.limit);
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

  getById = async (id: ID): Promise<Mining> => {
    return this.model.findById(id);
  };

  getByLevel = async (level: number): Promise<Mining> => {
    return this.model.findOne({ level: level });
  };

  create = async (nft: CreateMiningDto): Promise<Mining> => {
    return await this.model.create(nft);
  };

  update = async (id: ID, nft: UpdateMiningDto): Promise<Mining> => {
    return await this.model.findByIdAndUpdate(id, nft, { new: true });
  };

  delete = async (id: ID): Promise<Mining> => {
    return await this.model.findByIdAndDelete(id);
  };
}
