import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PlacesModule } from './places/places.module';
import { BusinessesModule } from './businesses/businesses.module';
import { TagsModule } from './tags/tags.module';
import { FilesModule } from './files/files.module';
import { EmailModule } from './email/email.module';
import { NotificationsModule } from './notifications/notifications.module';
import { NotificationUsersModule } from './notification-users/notification-users.module';
import { DevicesModule } from './devices/devices.module';
import { InvitationModule } from './invitation/invitation.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local'],
    }),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.sk8if.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
    ),
    CategoriesModule,
    AuthModule,
    UsersModule,
    PlacesModule,
    BusinessesModule,
    TagsModule,
    FilesModule,
    EmailModule,
    NotificationsModule,
    NotificationUsersModule,
    DevicesModule,
    InvitationModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
