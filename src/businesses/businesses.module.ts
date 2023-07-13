import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CaslModule } from '../casl/casl.module';
import { BusinessAbilities } from './business.abilities';
import { Business, BusinessSchema } from './business.schema';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { FilesService } from '../files/files.service';
import { EmailService } from '../email/email.service';
import { Invitation, InvitationSchema, User, UserSchema } from '../users/users.schema';

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
  providers: [BusinessesService, BusinessAbilities, FilesService, EmailService],
  exports: [BusinessesService],
})
export class BusinessesModule { }
