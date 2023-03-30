import type { Model } from 'mongoose';

import AuthToken, { IAuthToken } from './AuthToken/model';
import PassCodeToken, { IPassCodeToken } from './PassCodeToken/model';
import User, { IUser } from './User/model';

export type Models = {
  AuthToken: Model<IAuthToken, {}, {}, {}>;
  PassCodeToken: Model<IPassCodeToken, {}, {}, {}>;
  User: Model<IUser, {}, {}, {}>;
};

const models: Models = {
  AuthToken,
  PassCodeToken,
  User,
};

export default models;
