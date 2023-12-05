import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './device.schema';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { PushNotificationsService } from 'src/notifications/push-notifications.service';
import { NotificationSchema, Notification } from '../notifications/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }]),
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService, PushNotificationsService]
})
export class DevicesModule {}
