import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Business } from './business.schema';
import { Model } from 'mongoose';
import { CreateBusinessDTO } from './business.dto';

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
}
