import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeviceDto } from './dto/device.dto';
import { Device } from './device.schema';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) { }

  async create(createDeviceDto: CreateDeviceDto, userId?: string): Promise<Device> {
    const existingDevice = await this.deviceModel.findOne({ deviceUniqueId: createDeviceDto.deviceUniqueId }).exec();
    let device: Device;
    if (existingDevice) {
      if (existingDevice.fcmToken !== createDeviceDto.fcmToken) {
        existingDevice.fcmToken = createDeviceDto.fcmToken;
        device = await existingDevice.save();
      } else {
        device = existingDevice;
      }
    } else {
      device = new this.deviceModel({ ...createDeviceDto, userId: userId });
      try {
        await device.save();
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
