import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessesModule } from '../businesses/businesses.module';
import { BusinessesService } from '../businesses/businesses.service';
import { UsersController } from './users.controller';
import { UsersHooks } from './users.hooks';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [BusinessesModule],
        useFactory: new UsersHooks().hooks,
        inject: [BusinessesService],
      },
    ]),
  ],
  providers: [UsersService, UsersHooks],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
