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
import { FilesService } from '../files/files.service';

interface FindAllArgs {
  query: Partial<Business | { 'reviews.owner._id': string }>;
  projection: Partial<Record<keyof Business | string, number>>;
  options?: Record<any, any>;
}

@Injectable()
export class BusinessesService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<Business>,
    private readonly filesService: FilesService,
  ) { }

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

  async findAll(
    { query, projection, options }: FindAllArgs = {
      query: {},
      projection: {},
      options: {},
    },
  ): Promise<Business[]> {
    const pipelines: any = [
      { $match: { ...query } },
      {
        $addFields: {
          averageRatings: { $avg: '$reviews.rating' },
          favoritesCount: { $size: { $ifNull: ['$favorites', []] } },
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

  async findOne(_id: string): Promise<Business> {
    // Increment Views
    await this.businessModel.updateOne({ _id }, { $inc: { views: 1 } }).exec();
    // Query Single
    const pipelines: any = [
      { $match: { _id: Types.ObjectId(_id) } },
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
  ): Promise<Business> {
    return this.businessModel.updateOne({ _id }, updateBusinessDTO).exec();
  }

  async changeOwner(
    { _id }: { _id: string },
    updateOwnerDTO: UpdateOwnerDTO,
  ): Promise<Business> {
    return this.businessModel.updateOne({ _id }, updateOwnerDTO).exec();
  }

  async updateMany(
    { category }: { category: string },
    updateBusinessDTO: UpdateBusinessDTO,
  ): Promise<Business> {
    return this.businessModel
      .updateMany({ category }, updateBusinessDTO)
      .exec();
  }

  async remove(_id: string) {
    const business = await this.businessModel.findOne({ _id }).exec();

    if (business.thumbnail) {
      const thumbnailURL = new URL(business.thumbnail);
      this.filesService.deletePublicFile(thumbnailURL.pathname.replace(/^\/|\/$/g, ''));
    }

    if (business.gallery.length) {
      const files = business.gallery.map((image) => {
        const galleryImageURL = new URL(image.image);
        return { Key: galleryImageURL.pathname.replace(/^\/|\/$/g, '') };
      });
      this.filesService.deletePublicFiles(files);
    }

    return this.businessModel.deleteOne({ _id }).exec();
  }

  async removeManyByUser(userId: string): Promise<{ deletedCount?: number }> {

    const businesses = await this.findAll({
      query: { ownerId: userId.toString() },
      projection: {},
      options: {},
    });

    if (businesses?.length) {
      businesses.forEach(business => {
        if (business.thumbnail) {
          const thumbnailURL = new URL(business.thumbnail);
          this.filesService.deletePublicFile(thumbnailURL.pathname.replace(/^\/|\/$/g, ''));
        }

        if (business.gallery.length) {
          const files = business.gallery.map((image) => {
            const galleryImageURL = new URL(image.image);
            return { Key: galleryImageURL.pathname.replace(/^\/|\/$/g, '') };
          });
          this.filesService.deletePublicFiles(files);
        }
      })
    }

    return this.businessModel.deleteMany({ ownerId: userId }).exec();
  }

  // Favorites
  async createFavorite(_id, ownerId): Promise<Business> {
    await this.businessModel
      .updateOne({ _id }, { $addToSet: { favorites: { ownerId } } })
      .exec();
    return this.findOne(_id);
  }

  async removeFavorite(_id, ownerId): Promise<Business> {
    await this.businessModel
      .updateOne({ _id }, { $pull: { favorites: { ownerId } } })
      .exec();
    return this.findOne(_id);
  }

  async createReview(
    _id,
    owner,
    createReviewDTO: CreateReviewDTO,
  ): Promise<Business> {
    await this.businessModel
      .updateOne({ _id }, { $push: { reviews: { ...createReviewDTO, owner } } })
      .exec();
    return this.findOne(_id);
  }

  async updateReview(
    owner,
    updateReviewDTO: UpdateReviewUserDTO,
  ): Promise<Business> {
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

  async removeUserReviewsFromAllBusinesses(user): Promise<Business> {
    return this.businessModel
      .updateMany(
        { 'reviews.owner._id': user._id.toString() },
        {
          $pull: {
            reviews: { owner: user },
          },
        },
      )
      .exec();
  }
}
