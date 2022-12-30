import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) { }

  async create(createNotificationDto: CreateNotificationDto, id: string): Promise<Notification> {
    const createdNotification = new this.notificationModel({...createNotificationDto, ownerId: id});
    try {
      return await createdNotification.save();
    } catch (error) {
      console.log('notification create error', error);
      return error;
    }
  }

  async findAll(ownerId) {
    return this.notificationModel.find({ $or: [{ ownerId }, { ownerId: { $exists: false } }] });
  }

  findOne(id: string) {
    return this.notificationModel.findOne({ _id: id }).exec();
  }

  update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    return this.notificationModel.updateOne({ _id: id }, updateNotificationDto).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
