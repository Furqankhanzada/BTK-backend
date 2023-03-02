import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationUser, NotificationUserSchema } from './notification-users.schema';
import { NotificationUsersService } from './notification-users.service';
import { NotificationUsersController } from './notification-users.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: NotificationUser.name, schema: NotificationUserSchema }])],
  controllers: [NotificationUsersController],
  providers: [NotificationUsersService]
})
export class NotificationUsersModule {}
