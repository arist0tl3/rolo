import { Schema, model } from 'mongoose';

export interface IAuthToken {
  expiresAt: Date;
  phoneNumber: string;
  userId: string;
}

const authTokenSchema = new Schema<IAuthToken>({
  expiresAt: { type: Date, required: true },
  phoneNumber: { type: String, required: true },
  userId: { type: String, required: true },
});

const AuthToken = model<IAuthToken>('AuthToken', authTokenSchema);

export default AuthToken;
