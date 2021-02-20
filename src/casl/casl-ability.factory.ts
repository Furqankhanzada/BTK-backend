import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Document } from 'mongoose';
import { User } from '../users/users.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = string | Document | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export type CustomAbility = [Action, string, any?];

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User, abilities) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    if (user.roles.includes('ADMIN')) {
      can(Action.Manage, 'all');
    } else {
      abilities.forEach(([action, subject, condition]) => {
        can(action, subject, condition);
      });
    }

    return build();
  }
}
