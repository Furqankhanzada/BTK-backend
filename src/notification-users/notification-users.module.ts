import { Module } from '@nestjs/common';
import { NotificationUsersService } from './notification-users.service';
import { NotificationUsersController } from './notification-users.controller';
import { NotificationUser, NotificationUserSchema } from './notification-users.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: NotificationUser.name, schema: NotificationUserSchema }])],
  controllers: [NotificationUsersController],
  providers: [NotificationUsersService]
})
export class NotificationUsersModule {}
