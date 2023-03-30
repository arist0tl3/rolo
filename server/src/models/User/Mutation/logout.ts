import { IContext } from '../../../types';

import { LogoutResponse } from '../../../generated';

/**
 * Remove any auth tokens, essentially "logging the user out"
 */
async function logout(parent: undefined, args: undefined, context: IContext): Promise<LogoutResponse> {
  try {
    const phoneNumber = context?.currentUser?.phoneNumber;

    if (!phoneNumber) throw new Error('Unable to log this user out');

    // Remove the tokens
    const user = await context.models.User.findOne({ phoneNumber });
    if (!user) throw new Error('Unable to log this user out');

    await context.models.AuthToken.deleteMany({ userId: user._id });

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString(),
    };
  }
}

export default logout;
