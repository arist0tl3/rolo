import { IContext } from '../../../types';

import { PublicUser, QueryUserArgs } from '../../../generated';

/**
 * Returns a specific user
 */
async function user(parent: undefined, args: QueryUserArgs, context: IContext): Promise<PublicUser | null> {
  try {
    if (!context.currentUser) throw new Error('You must be logged in to do this');

    return context.models.User.findOne({
      _id: args.input.userId,

    });
  } catch (err) {
    return null;
  }
}

export default user;
