import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationUserDto } from './dto/notification-user.dto';
import { NotificationUser } from './notification-users.schema';

@Injectable()
export class NotificationUsersService {
  constructor(
    @InjectModel(NotificationUser.name) private notificationUserModel: Model<NotificationUser>,
  ) { }

  async create(createNotificationUserDto: CreateNotificationUserDto, userId: string): Promise<NotificationUser> {
    const existingReadNotification = await this.notificationUserModel.findOne({
      deviceUniqueId: createNotificationUserDto.deviceUniqueId,
      notificationId: createNotificationUserDto.notificationId
    }).exec();
    const createdNotificationUser = new this.notificationUserModel({ ...createNotificationUserDto, userId: userId, notificationId: new Types.ObjectId(createNotificationUserDto.notificationId) });

    if (existingReadNotification) {
      return existingReadNotification;
    } else {
      try {
        return await createdNotificationUser.save();
      } catch (error) {
        console.log('notification read error', error);
        return error;
      }
    }
  }
}
