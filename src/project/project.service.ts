import {
  BadRequestException,
  HttpException,
  forwardRef,
  Inject,
  Logger,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ID } from 'src/global/interfaces/id.interface';
import { ProblemCategoryService } from 'src/problem-category/problem-category.service';
import { ProjectHistoryService } from 'src/project-history/project-history.service';
import { UserService } from 'src/user/user.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectDto } from './dto/query-paging.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectStatusEnum } from './schema/project.schema';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    @InjectModel(Project)
    private readonly model: ReturnModelType<typeof Project>,
    @Inject(forwardRef(() => ProblemCategoryService))
    private readonly problemCategoryService: ProblemCategoryService,
    @Inject(forwardRef(() => ProjectHistoryService))
    private readonly projectHistoryService: ProjectHistoryService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    try {
      await this.problemCategoryService.isModelExist(
        createProjectDto.problemCategory,
      );
      const createdProject = await this.model.create(createProjectDto);
      this.logger.log(`created a new project by id#${createdProject?._id}`);
      return createdProject;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async LikeProjects(id, idproject) {
    const iduser = id;
    const nft: any = await this.model.findById(idproject);
    const likes = nft?.likes ? nft?.likes : [];
    if (!nft) {
      throw new HttpException(
        'not found nft have id ' + idproject,
        HttpStatus.BAD_REQUEST,
      );
    }
    // unlike
    if (likes.includes(id)) {
      const data = this.model.findByIdAndUpdate(
        idproject,
        {
          likes: likes.filter((item) => item.toString() !== iduser.toString()),
        },
        { new: true },
      );

      await this.projectHistoryService.unLikeHistory(iduser, idproject);

      this.logger.log(`unliked project #id${data?._id}`);

      return data;
    }
    //like
    if (!likes.includes(id)) {
      const data = this.model.findByIdAndUpdate(
        idproject,
        { likes: [...likes, iduser] },
        { new: true },
      );

      await this.projectHistoryService.powerHistory({
        userLove: id,
        projectLove: idproject,
        date: new Date().getTime(),
      });

      this.logger.log(`liked project #id${data?._id}`);
      return data;
    }
  }

  async get(query: QueryProjectDto) {
    const { page, limit, sortType, sortBy, ...filterQuery } = query;

    let pipeline: any = [
      {
        $lookup: {
          from: 'problemcategories',
          localField: 'problemCategory',
          foreignField: '_id',
          as: 'problem',
        },
      },
      {
        $unwind: '$problem',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'likes',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'nfts',
                localField: '_id',
                foreignField: 'owner',
                as: 'nfts',
              },
            },
            // { $unwind: '$nfts' },
          ],
          as: 'users',
        },
      },
    ];

    if (filterQuery.problem) {
      pipeline = [
        ...pipeline,
        {
          $match: {
            $expr: {
              $eq: ['$problem._id', { $toObjectId: filterQuery.problem }],
            },
          },
        },
      ];
    }

    if (filterQuery.status !== undefined) {
      pipeline.push({
        $match: {
          status: +filterQuery?.status,
        },
      });
    }

    // if (filterQuery.status !== undefined) {
    //   let number = +filterQuery.status;
    //   console.log(number, 'netx');
    //   // pipeline.push({
    //   //   $match: {
    //   //     status: +filterQuery?.status,
    //   //   },
    //   // });
    // }

    if (query.search) {
      pipeline.push({
        $match: {
          name: {
            $regex: filterQuery?.search || '',
            $options: 'i',
          },
        },
      });
    }
    // console.log(query);

    if (sortBy && sortType) {
      pipeline.push({
        $sort: {
          [sortBy]: sortType == '-1' ? -1 : 1,
        },
      });
    }

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
  }

  async mined() {
    try {
      return this.model.find({ status: ProjectStatusEnum.Mined });
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

  async mineValue(id: string) {
    try {
      const data = await this.model.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'likes',
            foreignField: '_id',
            pipeline: [
              {
                $lookup: {
                  from: 'nfts',
                  localField: '_id',
                  foreignField: 'owner',
                  as: 'nfts',
                },
              },
              {
                $unwind: '$nfts',
              },
              {
                $group: {
                  _id: '$_id',
                  total: { $sum: '$nfts.price' },
                },
              },
            ],
            as: 'users',
          },
        },
        // {
        //   $unwind: '$users',
        // },
        // {
        //   $group: {
        //     _id: '$users._id',
        //     mineValue: {
        //       $sum: '$users.nfts.price',
        //     },
        //   },
        // },
      ]);
      let result = data.filter((item) => item.users.length > 0);
      result = result.filter((item) => {
        let rs = false;
        item.users.forEach((like) => {
          if (like._id.toString() === id.toString()) {
            rs = true;
          }
        });
        return rs;
      });
      result = result.map((item) => {
        let total = 0;
        item.users.forEach((like) => {
          total += +like.total;
        });
        return {
          ...item,
          total,
        };
      });
      return result;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async viewer(id: ID) {
    try {
      let view = 0;
      const isProject = await this.model.findById(id).lean();

      if (!isProject) {
        throw new HttpException('Nft not fount !', HttpStatus.BAD_REQUEST);
      }

      if (isProject) {
        view = isProject.viewer + 1;
      }

      const updatedViewer = await this.model.findByIdAndUpdate(id, {
        viewer: view,
      });

      // console.log(isProject.viewer, view);
      return updatedViewer;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async detail(id: string) {
    try {
      const data = await this.model.aggregate([
        {
          $match: {
            $expr: {
              $eq: ['$_id', { $toObjectId: id }],
            },
          },
        },
        {
          $lookup: {
            from: 'problemcategories',
            localField: 'problemCategory',
            foreignField: '_id',
            as: 'problemCategory',
          },
        },
        {
          $unwind: '$problemCategory',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'likes',
            foreignField: '_id',
            as: 'users',
          },
        },
        {
          $lookup: {
            from: 'projecthistories',
            localField: '_id',
            foreignField: 'projectLove',
            as: 'projecthistories',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'creater',
            foreignField: '_id',
            as: 'creator',
          },
        },
        {
          $unwind: '$creator',
        },
      ]);
      return data;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  findOne(id: string) {
    try {
      return this.model.findById(id).populate('problemCategory');
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async vote(id: string, voteProject: any) {
    try {
      const vote = await this.findOne(id);

      let reduced = voteProject.power;

      if (!vote) {
        throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
      }

      if (vote.power) {
        voteProject.power = +vote.power + +voteProject.power;
      }

      let power =
        Number(parseInt(voteProject.power).toFixed(2)) < 0.01
          ? 0.01
          : Number(parseInt(voteProject.power).toFixed(2));

      const voted = await this.model.findByIdAndUpdate(
        id,
        {
          ...voteProject,
          power: +power,
        },
        { new: true },
      );
      this.logger.log(`voted a project by id#${voted._id}`);

      await this.projectHistoryService.powerHistory({
        user: voteProject.user,
        project: id,
        date: new Date().getTime(),
        power: power,
      });

      const user = await this.userService.deductedPower(
        voteProject.user,
        +reduced,
      );

      return { voted, user };
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      await this.problemCategoryService.isModelExist(
        updateProjectDto.problemCategory,
      );
      const updated = await this.model.findByIdAndUpdate(id, updateProjectDto, {
        new: true,
      });
      this.logger.log(`updated project by id#${updated._id}`);
      return updated;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }

  async remove(id: string) {
    try {
      const removed = await this.model.findByIdAndDelete(id);
      this.logger.log(`removed project by id#${removed._id}`);
      return removed;
    } catch (error) {
      this.logger.error(error?.message, error.stack);
      throw new BadRequestException(error?.message);
    }
  }
}
