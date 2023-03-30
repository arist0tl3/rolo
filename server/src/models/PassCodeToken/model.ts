import { Schema, model } from 'mongoose';

export interface IPassCodeToken {
  passCode: string;
  phoneNumber: string;
  expirationDate: Date;
}

const passCodeTokenSchema = new Schema<IPassCodeToken>({
  expirationDate: { type: Date, required: true },
  passCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const PassCodeToken = model<IPassCodeToken>('PassCodeToken', passCodeTokenSchema);

export default PassCodeToken;
