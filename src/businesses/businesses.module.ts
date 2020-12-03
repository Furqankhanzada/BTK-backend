import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './business.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }])],
  controllers: [BusinessesController],
  providers: [BusinessesService]
})
export class BusinessesModule {}
