import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateNotificationUserDto } from './dto/create-notification-user.dto';
import { NotificationUser } from './notification-users.schema';

@Injectable()
export class NotificationUsersService {
  constructor(
    @InjectModel(NotificationUser.name) private notificationUserModel: Model<NotificationUser>,
  ) { }

  async create(createNotificationUserDto: CreateNotificationUserDto, id: string): Promise<NotificationUser> {
    const createdNotificationUser = new this.notificationUserModel({ ...createNotificationUserDto, userId: id, notificationId: new Types.ObjectId(createNotificationUserDto.notificationId) });
    try {
      return await createdNotificationUser.save();
    } catch (error) {
      console.log('notification create error', error);
      return error;
    }
  }

  async findAll(userId: string) {
    return this.notificationUserModel.find({ $or: [{ userId }, { userId: { $exists: false } }] });
  }
}
