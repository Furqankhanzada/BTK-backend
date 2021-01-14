import { Injectable } from '@nestjs/common';
import { BusinessesService } from '../businesses/businesses.service';
import { UserSchema } from './users.schema';

@Injectable()
export class UsersHooks {
  async hooks(businessService: BusinessesService) {
    UserSchema.post('updateOne', async function() {
      try {
        const query: { _id: string } = this.getQuery();
        const updates: { avatar?: string; name: string } = this._update.$set;

        if (query?._id && updates?.name) {
          const ownerId = query._id;
          const { avatar, name } = updates;

          await businessService.updateReview({ _id: ownerId, name, avatar }, {});
        }
      } catch (error) {
        throw new Error('Failed to update user data in reviews.');
      }
    });

    return UserSchema;
  }
}
