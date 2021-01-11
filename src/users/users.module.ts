import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersController } from './users.controller';
import { BusinessesModule } from '../businesses/businesses.module';
import { BusinessesService } from '../businesses/businesses.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        imports: [BusinessesModule],
        useFactory: async (businessesService: BusinessesService) => {
          const schema = UserSchema;
          schema.post('updateOne', async function() {
            try {
              const query = this.getQuery();
              const userUpdates = this._update.$set;

              if (query?._id && userUpdates?.name) {
                const ownerId = query._id;
                const updates = {
                  avatar: userUpdates.avatar,
                  name: userUpdates.name,
                };

                await businessesService.updateReviewUser(ownerId, updates);
              }
            } catch (error) {
              throw new Error('Failed to update user data in reviews.');
            }
          });
          return schema;
        },
        inject: [BusinessesService],
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
