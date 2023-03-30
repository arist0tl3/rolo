import { Schema, model } from 'mongoose';

export type SearchableLocation = {
  coordinates: number[];
  type: string;
};

export const searchableLocationSchema = new Schema(
  {
    type: String,
    coordinates: { type: [Number] },
  },
  { _id: false },
);

export type LocationCoordinates = {
  lat: number;
  lng: number;
};

export type Location = {
  coordinates: LocationCoordinates;
  formattedAddress: string;
};

export interface IUser {
  _id: string;
  aboutMe?: string;
  age?: number;
  createdAt: Date;
  firstName?: string;
  followingPlaceIds?: string[];
  formattedAddress?: string;
  gender?: string;
  interests?: string[];
  isAdmin: boolean;
  kids?: string[];
  lastName?: string;
  lastVisitedNotificationsAt: Date;
  location?: SearchableLocation;
  occupation?: string;
  pets?: string[];
  phoneNumber: string;
  profileImageId: string;
  relationshipStatus?: string;
}

const userSchema = new Schema<IUser>({
  aboutMe: { type: String },
  age: { type: Number },
  createdAt: { type: Date, required: true, default: Date.now },
  firstName: { type: String },
  followingPlaceIds: { type: [String] },
  formattedAddress: { type: String },
  gender: { type: String },
  interests: { type: [String] },
  isAdmin: { type: Boolean, default: false },
  kids: { type: [String] },
  lastName: { type: String },
  lastVisitedNotificationsAt: { type: Date },
  location: { type: searchableLocationSchema, index: { type: '2dsphere' } },
  occupation: { type: String },
  pets: { type: [String] },
  phoneNumber: { type: String, required: true },
  profileImageId: { type: String },
  relationshipStatus: { type: String },
});

const User = model<IUser>('User', userSchema);

export default User;
