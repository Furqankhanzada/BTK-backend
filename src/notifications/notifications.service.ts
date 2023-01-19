import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.schema';

export interface findAllNotificationsOptions {
  deviceUniqueId: string;
  sort?: { createdAt: number }
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) { }

  async create(createNotificationDto: CreateNotificationDto, id?: string): Promise<Notification> {
    const createdNotification = new this.notificationModel({ ...createNotificationDto, ownerId: id });
    try {
      return await createdNotification.save();
    } catch (error) {
      console.log('notification create error', error);
      return error;
    }
  }

  async findAll(ownerId: string, options: findAllNotificationsOptions) {
    let pipeline = {};

    if (ownerId) {
      pipeline = [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$notificationId", "$$nId"] },
                { $or: [{ $eq: ["$userId", ownerId] }, { $eq: ["$deviceUniqueId", options.deviceUniqueId] }] },
              ]
            }
          }
        }
      ]
    } else {
      pipeline = [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$notificationId", "$$nId"] },
                { $eq: ["$deviceUniqueId", options.deviceUniqueId] }
              ]
            }
          }
        }
      ]
    }

    const pipelines: any = [
      { $match: { $or: [{ ownerId }, { ownerId: { $exists: false } }] } },
      {
        $lookup: {
          from: 'notificationusers',
          let: { nId: '$_id', nOwnerId: '$ownerId' },
          pipeline: pipeline,
          as: 'new',
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ read: { $arrayElemAt: ["$new.read", 0] } }, "$$ROOT"] } }
      },
      { $project: { new: 0 } }
    ];

    if (options?.sort) {
      pipelines.push({ $sort: options?.sort });
    }

    return this.notificationModel.aggregate(pipelines);
  }

  async findOne(id: string, ownerId: string) {
    const notification = await this.notificationModel.findOne({ _id: id }).exec();
    if (!notification.ownerId) {
      return notification;
    }

    if (notification.ownerId && notification.ownerId == ownerId) {
      return notification;
    } else return {
      "statusCode": 401,
      "message": "Unauthorized"
    }
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationModel.updateOne({ _id: id }, updateNotificationDto).exec();
  }

  remove(id: string): Promise<{ deletedCount?: number }> {
    return this.notificationModel.deleteOne({ _id: id }).exec();
  }
}
