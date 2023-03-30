import { gql } from 'apollo-server';
import { GraphQLDateTime } from 'graphql-iso-date';

import sharedTypeDefs from './sharedTypeDefs';

import UserResolvers from '../models/User/resolvers';
import UserTypeDefs from '../models/User/typeDefs';

const ScalarResolvers = {
  DateTime: GraphQLDateTime,
};

const ScalarTypeDefs = gql`
  scalar DateTime
`;

const schema = [
  {
    resolvers: ScalarResolvers,
    typeDefs: ScalarTypeDefs,
  },
  {
    typeDefs: sharedTypeDefs,
  },
  {
    resolvers: UserResolvers,
    typeDefs: UserTypeDefs,
  },
];

export default schema;
