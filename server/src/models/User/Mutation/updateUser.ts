import { UpdateQuery } from 'mongoose';

import type { CurrentUser, MutationUpdateUserArgs } from '../../../generated';
import type { IContext } from '../../../types';
import type { IUser } from '../model';

async function updateUser(parent: undefined, args: MutationUpdateUserArgs, context: IContext): Promise<CurrentUser | null> {
  try {
    if (!context?.currentUser?._id) throw new Error('You must be logged in to do that');

    const { firstName, lastName, ...rest } = args.input;

    const update: UpdateQuery<IUser> = {
      ...rest,
    };

    // ToDo: Better solution for required fields
    if (firstName) {
      update.firstName = firstName;
    }

    if (lastName) {
      update.lastName = lastName;
    }

    return context.models.User.findByIdAndUpdate(context?.currentUser?._id, update, {
      new: true,
    });
  } catch (err) {
    return null;
  }
}

export default updateUser;
