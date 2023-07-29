import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { Invitation, InvitationSchema } from './invitation.schema';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';

import { EmailService } from '../email/email.service';
import { BusinessesService } from '../businesses/businesses.service';
import { Business, BusinessSchema } from 'src/businesses/business.schema';
import { User, UserSchema } from 'src/users/users.schema';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
  ],
  controllers: [InvitationController],
  providers: [InvitationService, EmailService, BusinessesService, FilesService],
})
export class InvitationModule {}
