import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BusinessMembersDto,
  UpdateBusinessMembersDto,
} from './dto/create-business-members.dto';
import { BusinessMembers } from './business-members.schema';

@Injectable()
export class BusinessMembersService {
  constructor(
    @InjectModel(BusinessMembers.name)
    private businessMembersModel: Model<BusinessMembers>,
  ) {}

  async create(
    createBusinessMemberDto: BusinessMembersDto,
  ): Promise<BusinessMembers> {
    const createBusinessMemberList = new this.businessMembersModel(
      createBusinessMemberDto,
    );

    try {
      return await createBusinessMemberList.save();
    } catch (error) {
      console.log('create business member list error', error);
      return error;
    }
  }

  findOne(businessId: string) {
    return this.businessMembersModel.findOne({ businessId }).exec();
  }

  async update(
    { businessId }: { businessId: string },
    updateBusinessMembersDto: UpdateBusinessMembersDto,
  ): Promise<BusinessMembers> {
    return this.businessMembersModel
      .updateOne({ businessId }, updateBusinessMembersDto)
      .exec();
  }

  remove(businessId: string) {
    return this.businessMembersModel.deleteOne({ businessId }).exec();
  }
}
