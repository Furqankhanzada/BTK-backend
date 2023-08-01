import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateDeviceDto } from './dto/device.dto';
import { Device } from './device.schema';

import { PushNotificationsService } from '../notifications/push-notifications.service';
import { NotificationType, Notification } from '../notifications/notification.schema';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private readonly pushNotificationsService: PushNotificationsService,
  ) { }

  async create(createDeviceDto: CreateDeviceDto, userId?: string): Promise<Device> {
    const existingDevice = await this.deviceModel.findOne({ deviceUniqueId: createDeviceDto.deviceUniqueId }).exec();
    let device: Device;
    if (existingDevice) {
      if (existingDevice.fcmToken !== createDeviceDto.fcmToken) {
        existingDevice.fcmToken = createDeviceDto.fcmToken;
        device = await existingDevice.save();
      }

      if (!existingDevice.userId) {
        existingDevice.userId = userId;
        device = await existingDevice.save();
      }

      device = existingDevice;
    } else {
      device = new this.deviceModel({ ...createDeviceDto, userId: userId });

      const notificationData = {
        title: 'Welcome To Explore BTK',
        description: 'Please Enjoy your Journey, And Contact us if you have any queries/questions',
        video: 'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/assets/introduction/Introduction-explore-btk.mp4',
        link: 'explorebtk://contact-us',
        type: NotificationType.USER
      }
      const createdNotification = new this.notificationModel({ ...notificationData, userId: userId });

      try {
        await device.save();
        await createdNotification.save();
        this.pushNotificationsService.sendFirebaseMessage(createDeviceDto.fcmToken, {
          token: createDeviceDto.fcmToken,
          title: notificationData.title,
          message: notificationData.description,
          data: { deeplink: `explorebtk://notifications/${createdNotification.id}` },
          type: notificationData.type
        });
      } catch (error) {
        console.log('device create error', error);
        return error;
      }
    }
    return device;
  }

  findAll() {
    return this.deviceModel.find();
  }

  findOne(id: string) {
    return this.deviceModel.findOne({ _id: id }).exec()
  }
}
