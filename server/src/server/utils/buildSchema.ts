import { buildSubgraphSchema } from '@apollo/subgraph';

import schema from '../../schema';

export default function buildSchema() {
  // @ts-ignore
  return buildSubgraphSchema(schema);
}
