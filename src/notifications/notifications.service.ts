import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PushNotificationsService } from './push-notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { Notification } from './notification.schema';
import { Device } from 'src/devices/device.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    private readonly pushNotificationsService: PushNotificationsService
  ) {}

  async create(createNotificationDto: CreateNotificationDto, id?: string): Promise<Notification> {
    const createdNotification = new this.notificationModel({ ...createNotificationDto, ownerId: id });
    const devices = await this.deviceModel.find();
    const notificationDevices = [];

    devices.forEach((userDevice: Device) => {
      notificationDevices.push({
        token: userDevice.fcmToken,
        title: createNotificationDto.title,
        message: createNotificationDto.description,
        data: { link: createNotificationDto?.link ?? '' },
        type: createNotificationDto?.type
      })
    })

    try {
      const notification = await createdNotification.save();
      this.pushNotificationsService.sendFirebaseMessages(notificationDevices)
      return notification;
    } catch (error) {
      console.log('notification create error', error);
      return error;
    }
  }

  findAll(ownerId: string, deviceUniqueId: string, recent: boolean) {
    const pipeline = [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$notificationId', '$$nId'] },
              {
                ...(ownerId
                  ? {
                      $or: [
                        { $eq: ['$userId', ownerId] },
                        { $eq: ['$deviceUniqueId', deviceUniqueId] },
                      ],
                    }
                  : { $eq: ['$deviceUniqueId', deviceUniqueId] }),
              },
            ],
          },
        },
      },
    ]

    const pipelines: any = [
      { $match: { $or: [{ ownerId }, { ownerId: { $exists: false } }] } },
      {
        $lookup: {
          from: 'notificationusers',
          let: { nId: '$_id', nOwnerId: '$ownerId' },
          pipeline: pipeline,
          as: 'notificationUsers',
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [{ read: { $arrayElemAt: ["$notificationUsers.read", 0] } }, "$$ROOT"] } }
      },
      { $project: { notificationUsers: 0 } }
    ];

    if (recent) {
      pipelines.push({ $sort: { createdAt: -1 } });
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
