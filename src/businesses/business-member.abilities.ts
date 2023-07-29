import { Injectable } from '@nestjs/common';
import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../users/users.schema';

export const SUBJECT = 'Business';

@Injectable()
export class BusinessMemberAbilities {
  constructor(private abilityFactory: CaslAbilityFactory) {}

  get(user: User) {
    const abilities = [
      [Action.Create, SUBJECT, { ownerId: user._id }],
      [Action.Update, SUBJECT, { ownerId: user._id }],
      [Action.Delete, SUBJECT, { ownerId: user._id }],
    ];

    return this.abilityFactory.createForUser(user, abilities);
  }
}
