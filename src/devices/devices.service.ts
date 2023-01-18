import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './device.schema';

@Injectable()
export class DevicesService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) { }


  async create(createDeviceDto: CreateDeviceDto, id?: string): Promise<Device> {
    const isExistingDevice = await this.deviceModel.findOne({ deviceUniqueId: createDeviceDto.deviceUniqueId }).exec()
    const createdDevice = new this.deviceModel({ ...createDeviceDto, userId: id });

    if (isExistingDevice) {
      return isExistingDevice;
    }

    try {
      return await createdDevice.save();
    } catch (error) {
      console.log('device create error', error);
      return error;
    }
  }

  findAll() {
    return this.deviceModel.find();
  }

  findOne(id: string) {
    return this.deviceModel.findOne({ _id: id }).exec()
  }
}
