import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../casl/casl.module';
import { BusinessAbilities } from './business.abilities';
import { Business, BusinessSchema } from './business.schema';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { FilesService } from '../files/files.service';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    CaslModule,
  ],
  controllers: [BusinessesController],
  providers: [BusinessesService, BusinessAbilities, FilesService],
  exports: [BusinessesService],
})
export class BusinessesModule { }
