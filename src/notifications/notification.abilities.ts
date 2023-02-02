import { Injectable } from '@nestjs/common';
import { Action, CaslAbilityFactory } from '../casl/casl-ability.factory';
import { User } from '../users/users.schema';

export const SUBJECT = 'Notification';

@Injectable()
export class NotificationAbilities {
  constructor(private abilityFactory: CaslAbilityFactory) {}

  get(user: User) {
    const abilities = [
      [Action.Create, SUBJECT],
      [Action.Read, SUBJECT, { userId: user._id }],
      [Action.Update, SUBJECT, { userId: user._id }],
      [Action.Delete, SUBJECT, { userId: user._id }],
    ];

    return this.abilityFactory.createForUser(user, abilities);
  }
}
