import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Document } from 'mongoose';
import { Roles, User } from '../users/users.schema';
import { Invoice } from '../invoices/invoice.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = string | Document | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User, abilities) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.roles.includes(Roles.ADMIN)) {
      can(Action.Manage, 'all');
    } else {
      abilities.forEach(([action, subject, condition]) => {
        can(action, subject, condition);
      });

      can(Action.Read, Invoice.name);
      cannot(Action.Update, Invoice.name);
      cannot(Action.Delete, Invoice.name);
    }

    return build();
  }
}
