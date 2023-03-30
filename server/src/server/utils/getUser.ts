import jwt from 'jsonwebtoken';

import { Models } from '../../models';

export default async function getUser(authHeader: string | undefined, models: Models) {
  try {
    if (!authHeader || typeof authHeader !== 'string') return null;

    const token = authHeader.split('Bearer ')?.[1];
    if (!token) return null;

    const decoded = jwt.verify(token, 'secret') as jwt.JwtPayload;

    // Bad decode
    if (!decoded) throw new Error('Unable to verify this token');

    // Forged token?
    if (!decoded.hasOwnProperty('phoneNumber')) throw new Error('Unable to verify this token');

    // Somehow passing the wrong token?
    if (!decoded.hasOwnProperty('type')) throw new Error('Unable to verify this token');
    if (decoded?.type !== 'auth') throw new Error('Unable to verify this token');

    const { phoneNumber } = decoded;

    // Verify in the db; logout or dropping collection would prevent the token from being here
    // Check the auth token stored in the db
    const now = new Date();
    const authToken = await models.AuthToken.findOne({ phoneNumber, expiresAt: { $gte: now } });

    if (!authToken) throw new Error('Token has been revoked or expired');

    const user = await models.User.findById(authToken.userId);
    return user;
  } catch (err) {
    return null;
  }
}
