import { gql } from 'apollo-server';

const typeDefs = gql`
  input GenerateAndSendPassCodeInput {
    phoneNumber: String!
  }

  input ResolvePassCodeInput {
    location: LocationInput!
    passCode: String!
    phoneNumber: String!
  }

  type GenerateAndSendPassCodeResponse {
    success: Boolean!
    error: String
  }

  type LogoutResponse {
    success: Boolean!
    error: String
  }

  type ResolvePassCodeResponse {
    success: Boolean!
    token: String
    error: String
  }

  type CurrentUser {
    _id: String!
    createdAt: DateTime
    firstName: String
    lastName: String
    phoneNumber: String
  }

  type PublicUser {
    _id: String!
    firstName: String
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    phoneNumber: String
  }

  input UserInput {
    userId: String!
  }

  extend type Mutation {
    generateAndSendPassCode(input: GenerateAndSendPassCodeInput!): GenerateAndSendPassCodeResponse!
    logout: LogoutResponse!
    resolvePassCode(input: ResolvePassCodeInput!): ResolvePassCodeResponse!
    updateUser(input: UpdateUserInput!): CurrentUser
  }

  extend type Query {
    currentUser: CurrentUser
    user(input: UserInput!): PublicUser
  }
`;

export default typeDefs;
