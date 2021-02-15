import { Injectable } from '@nestjs/common';
import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../users/users.schema';

export const SUBJECT = 'Business';

@Injectable()
export class UsersAbilities {
  constructor(private abilityFactory: CaslAbilityFactory) {}

  get(user: User) {
    const abilities = [
      [Action.Update, SUBJECT, { _id: user._id }],
      [Action.Delete, SUBJECT, { _id: user._id }],
    ];

    return this.abilityFactory.createForUser(user, abilities);
  }
}
