import jwt from 'jsonwebtoken';

import { IContext } from '../../../types';
import { MutationResolvePassCodeArgs, ResolvePassCodeResponse } from '../../../generated';

/**
 * Exchange a valid, short lived login token for a long-lived auth token that can be used
 * to make authenticated calls and revoked if necessary
 */
async function resolvePassCode(parent: undefined, args: MutationResolvePassCodeArgs, context: IContext): Promise<ResolvePassCodeResponse> {
  try {
    const { location, phoneNumber, passCode } = args.input;

    const now = new Date();

    const passCodeToken = await context.models.PassCodeToken.findOne({
      phoneNumber,
      passCode,
      expirationDate: {
        $gte: now,
      },
    });

    if (!passCodeToken) throw new Error('Unable to verify this code');

    // Remove token
    await context.models.PassCodeToken.findByIdAndRemove(passCodeToken._id);

    // Create user
    let user = await context.models.User.findOne({ phoneNumber });

    if (!user) {
      if (!location?.coordinates) throw new Error("Unable to verify user's address");

      user = await context.models.User.create({
        formattedAddress: location?.formattedAddress,
        location: {
          type: 'Point',
          coordinates: [location.coordinates.lng, location.coordinates.lat],
        },
        phoneNumber,
      });
    }

    // Create new token w/30 day expiry
    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + 24 * 30);

    const token = jwt.sign(
      {
        phoneNumber,
        type: 'auth',
      },
      'secret',
    );

    // Store the token
    await context.models.AuthToken.create({
      expiresAt: expirationDate,
      phoneNumber,
      userId: user._id,
    });

    return {
      success: true,
      token,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.toString(),
    };
  }
}

export default resolvePassCode;
