import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { Device, DeviceSchema } from 'src/devices/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }]),
    MongooseModule.forFeature([{ name: Device.name, schema: DeviceSchema }])
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway]
})
export class NotificationsModule {}
