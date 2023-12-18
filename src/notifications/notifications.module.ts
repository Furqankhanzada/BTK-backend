import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { NotificationsService } from './notifications.service';
import { PushNotificationsService } from './push-notifications.service';
import { NotificationAbilities } from './notification.abilities';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { Device, DeviceSchema } from 'src/devices/device.schema';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
    CaslModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    PushNotificationsService,
    NotificationAbilities,
    NotificationsGateway,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}
