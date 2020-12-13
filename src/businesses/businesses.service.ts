import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Business } from './business.schema';
import { Model } from 'mongoose';
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

  async findAll({
                  query = {},
                  projection = {},
                  options = {}
                } = {}
  ): Promise<Business[]> {
    return this.businessModel.find(query, projection, { sort: { createdAt: -1 }, ...options }).exec();
  }

  async findOne(_id: string): Promise<Business> {
    await this.businessModel.updateOne({ _id }, { $inc: { views: 1 } }).exec();
    return this.businessModel.findOne({ _id }).exec();
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
