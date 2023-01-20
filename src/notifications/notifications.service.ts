import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { initializeApp, cert } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { chunk } from 'lodash';
import { mapLimit } from 'async';
import * as shell from 'shelljs';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.schema';
import { Device } from 'src/devices/device.schema';

export interface findAllNotificationsOptions {
  deviceUniqueId: string;
  sort?: { createdAt: number }
}

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {
    initializeApp({
      credential: cert({
        "projectId": "explore-btk",
        "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC64iCrXbJyzYYM\nTS3sokn8vO4OZ4uHokH5ft7L5a2SGid016zO0Rq0nuXdSJpfBJ4cRKfDt8M4IsSL\nUgwqXzUtPEb57vGVdC3XE4pCZyGXXLJz+9Y0z3vOFQvHNkVNhzF9jHJ+fAKPa+Ml\nDr+f1mp0RstCDIoHm8NW3GL2gc6ZnV/kZl7/eAhkZohG5ux798YWOi5wZ1cJYOj1\nVRxWQVGaU2uajBrA7PSJq+wzoJzGnVN5wFI1zUsOd1/ftUfRK4BYSFYX0VZK6dqu\nGp1S76HofxFhh+m/NWCNCYrMPum+C/U5SHKhuUhMDhXdWSmI+7SaSU/WeEOM0fTp\ngyIgN0R7AgMBAAECggEAPqixxnNAcTCKuNYpxzT0tKpN8QNzq3LSRwpsPhYQl7Nw\nNkNX+/HtT9EVBhghNimQr66vRzZ2XHx/xKyqSoyogjW7IHKminMtKXcyPKhigWMB\nrFSsUgGdI5A35j/ChceF5u/vtYvzuc21F4g15KwZ/kl8PfWBVCK8IIP9JGSKdkNU\nbCObMXTSjKBCM/6khfM7t/3VS+WhbdiQpSEPHPwE9aynOpxGJIMOoTQbnWQOJvDW\n7m23kCTinVY8W78P1O+HDaE9zBhV4nPH5iou1kKDPeN2LCm+L/PgJID9SMFsDbTt\nxkw4FZLpzFiwXQ1k0VUSPdNd9yHBPB4n1x6zAToVZQKBgQDnP1z/NdtNzYBUKonm\nQiwZmsvCR0QU3S/sFjqEvCEblA0zLYcvrjwSsHXfKzYNmkemW1xMDbSKwe3mOw0S\nL1jPumzpbWeVxd7Bp8TGkjIfO6LIDIW/eR6RHJ+9Kr05PTeJ85YAvsk8AHEfSujJ\n6uVRAIm6gQFE/WOzVLgGWOq+NQKBgQDO4xkTNXE56VJ7/aSgoJz6HKkbp11j4iE+\nDCFaOK+pu+cVmwbO+YkQugUveLHpYF2Nq9GpA2kB+zgPVt/GcNWwpNgL9SeYcd7l\n21mnhFunJeBqcmXHG/FsTqqX9GQVC29LNqsJXgqotefa9TDIBRn/9LgfqjOQPQLf\n/QvoFKsN7wKBgHoCMnzs24KXVIgT0aJNc5sm0y70DvW7Jhe4OrPh1s4INVa1RMhh\nc4yg0fAnimNu7TLWrUHrUUCMxYpdya24kXE4eVJHyQl61ubyL55dcFiOTHqkMMUv\nkHMb2SQjsqbKp8z/WjuWbfJcgVLzYRN3/fnZANIIUrUlxD7QCjA/JcupAoGBAKce\nJSQyGEtKYRnNUs150DPtMOEoubS0dlvTmqFxhtxZ75mxR7erNH/xc7zcBwLYl9mX\nwF2BZrJ2BtvFNi/q94KgNfC60IhA+2e7X1mE/jAv1W7HB9XliYgOp5jljm69dOJR\nv6lqcLvFbQue4g/ApzbtrEnPx6Us04SxuIt5Ho+7AoGAOvGW2uo6YEv69iQXSuGR\nnkMFNpxVU1r7rScUrYUsy5wSfHGLO9l5NMOf8NC1LbWe0UvovQKbnzw94fPmvqo/\nDarlj3ssZ8bxZRAchCz5Xu6KHb3xQVScXUodxadcxE9SF381Tz9sG9jzfOpAeaUm\nWuzqgqkuI6y56rVenJcG+JA=\n-----END PRIVATE KEY-----\n",
        "clientEmail": "firebase-adminsdk-upt6q@explore-btk.iam.gserviceaccount.com",
      }),
      databaseURL: "https://explore-btk-default-rtdb.asia-southeast1.firebasedatabase.app",
    });
  }

  public async sendFirebaseMessages(firebaseMessages: ISendFirebaseMessages[], dryRun?: boolean): Promise<BatchResponse> {
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);

    const batchResponses = await mapLimit<ISendFirebaseMessages[], BatchResponse>(
      batchedFirebaseMessages,
      3, // 3 is a good place to start
      async (groupedFirebaseMessages: ISendFirebaseMessages[]): Promise<BatchResponse> => {
        try {
          const tokenMessages: any = groupedFirebaseMessages.map(({ message, title, token }) => ({
            notification: { body: message, title },
            token,
            apns: {
              payload: {
                aps: {
                  'content-available': 1,
                },
              },
            },
          }));

          return await this.sendAll(tokenMessages, dryRun);
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
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

  public async sendAll(messages: any, dryRun?: boolean): Promise<BatchResponse> {
    if (process.env.NODE_ENV === 'local') {
      for (const { notification, token } of messages) {
        shell.exec(
          `echo '{ "aps": { "alert": ${JSON.stringify(notification)}, "token": "${token}" } }' | xcrun simctl push booted com.company.appname -`,
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
        message: createNotificationDto.description
      })
    })

    try {
      this.sendFirebaseMessages(notificationDevices)
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

