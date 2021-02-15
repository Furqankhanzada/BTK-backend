import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../casl/casl.module';
import { BusinessAbilities } from './business.abilities';
import { Business, BusinessSchema } from './business.schema';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
    ]),
    CaslModule,
  ],
  controllers: [BusinessesController],
  providers: [BusinessesService, BusinessAbilities],
  exports: [BusinessesService],
})
export class BusinessesModule {}
