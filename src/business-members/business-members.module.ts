import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessMembersService } from './business-members.service';
import { BusinessMembersController } from './business-members.controller';
import {
  BusinessMembers,
  businessMembersSchema,
} from './business-members.schema';
import { BusinessesService } from 'src/businesses/businesses.service';
import { Business, BusinessSchema } from 'src/businesses/business.schema';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessMembers.name, schema: businessMembersSchema },
    ]),
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
    ]),
  ],
  controllers: [BusinessMembersController],
  providers: [BusinessMembersService, BusinessesService, FilesService],
})
export class BusinessMembersModule {}
