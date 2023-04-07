export type Place = {
  coordinates: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
  googlePlaceId: string;
  locationName: string;
};

export type Contact = {
  _id: string;
  firstName: string;
  notes?: string;
  place?: Place;
  shifts?: number[];
};
