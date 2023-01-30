import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { messaging } from 'firebase-admin/lib/messaging/messaging-namespace';
import { chunk } from 'lodash';
import { mapLimit } from 'async';
import * as shell from 'shelljs';

import { CreateNotificationDto, UpdateNotificationDto } from './dto/notification.dto';
import { Notification } from './notification.schema';
import { Device } from 'src/devices/device.schema';

export interface PushNotificationMessage {
  token: string;
  title?: string;
  message: string;
  data?: { link: string };
  type?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {
    initializeApp({
      credential: cert({
        "projectId": `${process.env.FIREBASE_PROJECT_ID}`,
        "privateKey": `${process.env.FIREBASE_PRIVATE_KEY
          ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
          : undefined}`,
        "clientEmail": `${process.env.FIREBASE_CLIENT_EMAIL}`,
      }),
      databaseURL: `${process.env.FIREBASE_DATABASE_URL}`,
    });
  }

  public async sendFirebaseMessages(messages: PushNotificationMessage[], dryRun?: boolean): Promise<BatchResponse> {
    const batchesOfMessages = chunk(messages, 500);

    const batchResponses = await mapLimit<PushNotificationMessage[], BatchResponse>(
      batchesOfMessages,
      3, // 3 is a good place to start
      async (batchesOfMessages: PushNotificationMessage[]): Promise<BatchResponse> => {
        try {
          const fcmMessages: messaging.TokenMessage[] = batchesOfMessages.map(({ message, title, token, data, type }) => ({
            notification: { body: message, title },
            token,
            data: data as {
              [key: string]: string;
            },
            android: { notification: { channelId: type || 'Announcement' } },
            apns: {
              payload: {
                aps: {
                  'content-available': 1,
                },
              },
            },
          }));

          return await this.sendAll(fcmMessages, dryRun);
        } catch (error) {
          return {
            responses: batchesOfMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: batchesOfMessages.length,
          };
        }
      },
    );

    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      ({
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown) as BatchResponse,
    );
  }

  public async sendAll(messages: messaging.TokenMessage[], dryRun?: boolean): Promise<BatchResponse> {
    if (process.env.NODE_ENV === 'local') {
      for (const { notification, token } of messages) {
        shell.exec(
          `echo '{ "aps": { "alert": ${JSON.stringify(notification)}, "token": "${token}" } }' | xcrun simctl push booted com.explore.btk -`,
        );
      }
    }

    return getMessaging().sendAll(messages, dryRun);
  }

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
      this.sendFirebaseMessages(notificationDevices)
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
