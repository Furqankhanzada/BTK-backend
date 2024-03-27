import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CaslModule } from '../casl/casl.module';
import { BusinessAbilities } from './business.abilities';
import { BusinessMemberAbilities } from './business-member.abilities';
import { Business, BusinessSchema } from './business.schema';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { FilesService } from '../files/files.service';
import { EmailService } from '../email/email.service';
import { User, UserSchema } from '../users/users.schema';
import { Invitation, InvitationSchema } from '../invitation/invitation.schema';
import { InvitationService } from '../invitation/invitation.service';
import { InvoicesService } from 'src/invoices/invoices.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    CaslModule,
  ],
  controllers: [BusinessesController],
  providers: [
    BusinessesService,
    BusinessAbilities,
    BusinessMemberAbilities,
    FilesService,
    EmailService,
    InvitationService,
    InvoicesService,
  ],
  exports: [BusinessesService],
})
export class BusinessesModule {}
