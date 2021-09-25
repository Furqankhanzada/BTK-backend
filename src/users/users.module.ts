import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../casl/casl.module';
import { UsersAbilities } from './users.abilities';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import {
  MongoEvents,
  MongoEventsModule
} from '../mongoose-events/mongoose.events.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: function (events: MongoEvents) {
          return events.forSchema(User.name, UserSchema);
        }, // register events on schema
        inject: [MongoEvents],
        imports: [MongoEventsModule]
      }
    ]),
    CaslModule
  ],
  providers: [UsersService, UsersAbilities],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
