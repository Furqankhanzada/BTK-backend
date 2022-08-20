import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Business } from './business.schema';
import { Model, Types } from 'mongoose';
import {
  CreateBusinessDTO,
  UpdateBusinessDTO,
  CreateReviewDTO,
  UpdateReviewUserDTO,
  UpdateOwnerDTO,
} from './business.dto';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<Business>,
  ) {}

  async create(
    createBusinessDTO: CreateBusinessDTO,
    ownerId,
  ): Promise<Business> {
    const createdBusiness = new this.businessModel({
      ...createBusinessDTO,
      ownerId,
    });
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
    options = {},
  }: any = {}): Promise<Business[]> {
    const pipelines: any = [
      { $match: { ...query } },
      {
        $addFields: {
          averageRatings: { $avg: '$reviews.rating' },
          favorites: { $size: { $ifNull: ['$favorites', []] } },
        },
      },
      { $sort: { 'dist.calculated': 1 } },
      { $skip: options.skip || 0 },
      { $limit: options.limit || 20 },
    ];

    if (options?.geoLocation?.coordinates) {
      pipelines.splice(0, 0, {
        $geoNear: {
          near: { type: 'Point', coordinates: options.geoLocation.coordinates },
          includeLocs: 'dist.location',
          distanceField: 'dist.calculated',
          maxDistance: options.geoLocation.maxDistance,
        },
      });
    }

    if (Object.keys(projection).length) {
      pipelines.push({ $project: projection });
    }

    // Default sort is location. If location does not exist, sort by views and ratings.
    if (!options?.geoLocation?.coordinates) {
      const sortPipeline = pipelines.find(pipeline => !!pipeline.$sort);
      sortPipeline && (sortPipeline.$sort = { averageRatings: -1, views: -1 }); // Order matters.
    }

    // If a sort option is provided, override.
    if (options && options.sort && Object.keys(options).length) {
      const sortPipeline = pipelines.find(pipeline => !!pipeline.$sort);
      sortPipeline && (sortPipeline.$sort = options.sort);
    }

    return this.businessModel.aggregate(pipelines);
  }

  async findOne(_id: string, projection = {}): Promise<Business> {
    // Increment Views
    await this.businessModel.updateOne({ _id }, { $inc: { views: 1 } }).exec();
    // Query Single
    const pipelines: any = [
      { $match: { _id: new Types.ObjectId(_id) } },
      {
        $addFields: {
          reviewStats: {
            averageRatings: { $avg: '$reviews.rating' },
            oneStarCount: {
              $sum: {
                $map: {
                  input: '$reviews',
                  as: 'review',
                  in: {
                    $cond: [
                      {
                        $eq: [{ $floor: '$$review.rating' }, 1],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            twoStarCount: {
              $sum: {
                $map: {
                  input: '$reviews',
                  as: 'review',
                  in: {
                    $cond: [
                      {
                        $eq: [{ $floor: '$$review.rating' }, 2],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            threeStarCount: {
              $sum: {
                $map: {
                  input: '$reviews',
                  as: 'review',
                  in: {
                    $cond: [
                      {
                        $eq: [{ $floor: '$$review.rating' }, 3],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            fourStarCount: {
              $sum: {
                $map: {
                  input: '$reviews',
                  as: 'review',
                  in: {
                    $cond: [
                      {
                        $eq: [{ $floor: '$$review.rating' }, 4],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
            fiveStarCount: {
              $sum: {
                $map: {
                  input: '$reviews',
                  as: 'review',
                  in: {
                    $cond: [
                      {
                        $eq: [{ $floor: '$$review.rating' }, 5],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      },
    ];

    const businesses = await this.businessModel.aggregate(pipelines).exec();
    return businesses && businesses.length ? businesses[0] : null;
  }

  async getOne({ _id }: { _id: string }): Promise<Business> {
    return this.businessModel.findOne({ _id }).exec();
  }

  async update(
    { _id }: { _id: string },
    updateBusinessDTO: UpdateBusinessDTO,
  ): Promise<any> {
    return this.businessModel.updateOne({ _id }, updateBusinessDTO).exec();
  }

  async changeOwner(
    { _id }: { _id: string },
    updateOwnerDTO: UpdateOwnerDTO,
  ): Promise<any> {
    return this.businessModel.updateOne({ _id }, updateOwnerDTO).exec();
  }

  async updateMany(
    { category }: { category: string },
    updateBusinessDTO: UpdateBusinessDTO,
  ): Promise<any> {
    return this.businessModel
      .updateMany({ category }, updateBusinessDTO)
      .exec();
  }

  async remove(_id: string): Promise<{ deletedCount?: number }> {
    return this.businessModel.deleteOne({ _id }).exec();
  }

  // Favorites
  async createFavorite(_id, ownerId): Promise<Business> {
    await this.businessModel
      .updateOne({ _id }, { $addToSet: { favorites: { ownerId } } })
      .exec();
    return this.findOne(_id);
  }

  async removeFavorite(_id, ownerId): Promise<any> {
    await this.businessModel
      .updateOne({ _id }, { $pull: { favorites: { ownerId } } })
      .exec();
    return this.findOne(_id);
  }

  async createReview(
    _id,
    owner,
    createReviewDTO: CreateReviewDTO,
  ): Promise<any> {
    return this.businessModel
      .updateOne({ _id }, { $push: { reviews: { ...createReviewDTO, owner } } })
      .exec();
  }

  async updateReview(
    owner,
    updateReviewDTO: UpdateReviewUserDTO,
  ): Promise<any> {
    const updates = {};

    Object.entries(updateReviewDTO).forEach(([key, value]) => {
      updates[`reviews.$.${key}`] = value;
    });

    if (owner.avatar) {
      updates[`reviews.$.owner.avatar`] = owner.avatar;
    }

    if (owner.name) {
      updates[`reviews.$.owner.name`] = owner.name;
    }

    return this.businessModel
      .updateMany({ 'reviews.owner._id': owner._id }, { $set: updates })
      .exec();
  }
}
