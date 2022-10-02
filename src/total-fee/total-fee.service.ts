import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTotalFeeDto } from './dto/create-total-fee.dto';
import { QueryTotalFreeDto } from './dto/query-total-fee.dto';
import { UpdateTotalFeeDto } from './dto/update-total-fee.dto';
import { TotalFee } from './schema/total-fee.schema';

@Injectable()
export class TotalFeeService {
  private readonly logger = new Logger(TotalFeeService.name);
  constructor(
    @InjectModel(TotalFee)
    private readonly model: ReturnModelType<typeof TotalFee>,
  ) {}

  async findAll(query: QueryTotalFreeDto) {
    try {
      let tmp: any = [];

      if (query.sortBy !== undefined && query.sortBy.length > 0) {
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
              currentLevel: -1,
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
    } catch (error) {
      console.log(error);
    }
  }

  async list() {
    try {
      return await this.model.find();
    } catch (error) {
      console.log(error);
    }
  }

  async createAndUpdateGas(query: { gas: number }) {
    try {
      const data = await this.model.find();

      if (data.length > 0) {
        let gas = +data[0].gas + +query.gas;
        return await this.update(data[0]?._id, { gas });
      }

      return this.model.create({ gas: query.gas });
    } catch (error) {
      console.log(error);
    }
  }

  async update(id: string, payload) {
    try {
      return this.model.findByIdAndUpdate(id, payload);
    } catch (error) {
      console.log(error);
    }
  }
}
