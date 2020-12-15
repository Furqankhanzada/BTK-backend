import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Business } from './business.schema';
import { Model, Types } from 'mongoose';
import { CreateBusinessDTO, UpdateBusinessDTO, CreateReviewDTO } from './business.dto';

@Injectable()
export class BusinessesService {
  constructor(@InjectModel(Business.name) private businessModel: Model<Business>) {}

  async create(createBusinessDTO: CreateBusinessDTO, ownerId): Promise<Business> {
    const createdBusiness = new this.businessModel({ ...createBusinessDTO, ownerId });
    try {
      return await createdBusiness.save();
    } catch (error) {
      console.log('business create error', error);
      return error;
    }
  }

  async findAll({ query = {}, projection = {}, options = {} }: any = {}): Promise<Business[]> {
    const pipelines: any = [
      { $match: query },
      { $addFields: {
          averageRatings: { $avg: '$reviews.rating' },
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: options.skip },
      { $limit: options.limit }
    ];
    if (Object.keys(projection).length) {
      pipelines.push({ $project : projection })
    }
    if (options && options.sort && Object.keys(options).length) {
      const sortPipeline = pipelines.find((pipeline) => !!pipeline.$sort);
      sortPipeline && (sortPipeline.$sort = options.sort);
    }
    return this.businessModel.aggregate(pipelines);
  }

  async findOne(_id: string, projection = {}): Promise<Business> {
    // Increment Views
    await this.businessModel.updateOne({ _id }, { $inc: { views: 1 } }).exec();
    // Query Single
    const pipelines: any = [
      { $match: { _id: Types.ObjectId(_id) } },
      { $addFields: {
          averageRatings: { $avg: '$reviews.rating' },
        }
      }
    ];
    const businesses = await this.businessModel.aggregate(pipelines).exec();
    return businesses && businesses.length ? businesses[0] : null;
  }

  async update({ _id, ownerId }: { _id: string, ownerId: string }, updateBusinessDTO: UpdateBusinessDTO): Promise<Business> {
    return this.businessModel.updateOne({ _id, ownerId }, updateBusinessDTO).exec();
  }

  async remove(_id: string): Promise<{ deletedCount?: number }> {
    return this.businessModel.deleteOne({ _id }).exec();
  }

  async createReview(_id, owner, createReviewDTO: CreateReviewDTO): Promise<Business> {
    return this.businessModel.updateOne({ _id }, { $push: { reviews: { ...createReviewDTO, owner }} }).exec();
  }
}
