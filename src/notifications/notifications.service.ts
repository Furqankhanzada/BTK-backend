import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PushNotificationsService } from './push-notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { Notification } from './notification.schema';
import { NotificationAbilities } from './notification.abilities';
import { Device } from 'src/devices/device.schema';
import { User } from 'src/users/users.schema';
import { Action } from 'src/casl/casl-ability.factory';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    private readonly pushNotificationsService: PushNotificationsService,
    private readonly notificationAbility: NotificationAbilities,
  ) { }

  async create(createNotificationDto: CreateNotificationDto, ownerId?: string): Promise<Notification> {
    const createdNotification = new this.notificationModel({ ...createNotificationDto, userId: ownerId });
    const devices = await this.deviceModel.find();
    const notificationDevices = [];

    try {
      const notification = await createdNotification.save();

      devices.forEach((userDevice: Device) => {
        notificationDevices.push({
          token: userDevice.fcmToken,
          title: createNotificationDto.title,
          message: createNotificationDto.description,
          data: { deeplink: createNotificationDto.link ?? `explorebtk://notifications/${notification.id}` },
          type: createNotificationDto?.type
        })
      })

      this.pushNotificationsService.sendFirebaseMessages(notificationDevices)
      return notification;
    } catch (error) {
      console.log('notification create error', error);
      return error;
    }
  }

  findAll(userId: string, deviceUniqueId: string, recent: boolean) {
    const pipeline = [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$notificationId', '$$nId'] },
              {
                ...(userId
                  ? {
                    $or: [
                      { $eq: ['$userId', userId] },
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
      { $match: { $or: [{ userId }, { userId: { $exists: false } }] } },
      {
        $lookup: {
          from: 'notificationusers',
          let: { nId: '$_id', nUserId: '$userId' },
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

  async findOne(id: string, user: User) {
    const notification = await this.notificationModel.findOne({ _id: id }).exec();

    if (!notification.userId) {
      return notification;
    }

    if (!user) throw new UnauthorizedException();

    const ability = this.notificationAbility.get(user);

    if (!ability.can(Action.Read, notification)) {
      throw new UnauthorizedException();
    }

    return notification;
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationModel.updateOne({ _id: id }, updateNotificationDto).exec();
  }

  remove(id: string): Promise<{ deletedCount?: number }> {
    return this.notificationModel.deleteOne({ _id: id }).exec();
  }
}
