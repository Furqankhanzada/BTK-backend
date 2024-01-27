import { Injectable } from '@nestjs/common';
import { BusinessesService } from '../businesses/businesses.service';
import { UserSchema } from './users.schema';

@Injectable()
export class UsersHooks {
  async hooks(businessService: BusinessesService) {
    UserSchema.post('findOneAndUpdate', async function() {
      try {
        const query = this.getQuery();
        const updates = (this.getUpdate() as unknown) as {
          name?: string;
          avatar?: string;
        };
        console.log('query ### ', query);
        if (query?._id && updates?.name) {
          const ownerId = query._id;
          const { avatar, name } = updates;

          await businessService.updateReview(
            { _id: ownerId, name, avatar },
            {},
          );
        }
      } catch (error) {
        throw new Error('Failed to update user data in reviews.');
      }
    });

    return UserSchema;
  }
}
