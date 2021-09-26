import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CaslModule } from '../casl/casl.module';
import { UsersAbilities } from './users.abilities';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { MongoEventsService } from '../mongo-events/mongo-events.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: function (events: MongoEventsService) {
          return events.forSchema(User.name, UserSchema);
        },
        inject: [MongoEventsService]
      }
    ]),
    CaslModule
  ],
  providers: [UsersService, UsersAbilities],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
