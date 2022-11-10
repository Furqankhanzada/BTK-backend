import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessesModule } from '../businesses/businesses.module';
import { CaslModule } from '../casl/casl.module';
import { UsersAbilities } from './users.abilities';
import { UsersController } from './users.controller';
import { UsersHooks } from './users.hooks';
import { User } from './users.schema';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: new UsersHooks().hooks,
      },
    ]),
    CaslModule,
    BusinessesModule,
  ],
  providers: [UsersService, UsersHooks, UsersAbilities],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
