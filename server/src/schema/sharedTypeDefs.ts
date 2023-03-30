import { gql } from 'apollo-server';

const sharedTypeDefs = gql`
  type Location {
    coordinates: [Float!]!
    type: String!
  }

  ## ToDo: Clean this up so inputs/outputs match
  input LocationCoordinatesInput {
    lat: Float
    lng: Float
  }

  input LocationInput {
    coordinates: LocationCoordinatesInput
    formattedAddress: String
    locationName: String
  }
`;

export default sharedTypeDefs;
