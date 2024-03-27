import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { PushNotificationsService } from '../notifications/push-notifications.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { CaslModule } from '../casl/casl.module';
import { BusinessesService } from 'src/businesses/businesses.service';
import { Business, BusinessSchema } from 'src/businesses/business.schema';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/users.schema';
import { FilesService } from 'src/files/files.service';
import { Invitation, InvitationSchema } from 'src/invitation/invitation.schema';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    NotificationsModule,
    CaslModule,
  ],
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    PushNotificationsService,
    BusinessesService,
    UsersService,
    FilesService,
    EmailService,
  ],
  exports: [InvoicesService],
})
export class InvoicesModule {}
