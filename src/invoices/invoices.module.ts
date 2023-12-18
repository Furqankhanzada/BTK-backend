import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { UsersModule } from '../users/users.module';
import { BusinessesModule } from '../businesses/businesses.module';
import { PushNotificationsService } from '../notifications/push-notifications.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    UsersModule,
    BusinessesModule,
    NotificationsModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, PushNotificationsService],
})
export class InvoicesModule {}
