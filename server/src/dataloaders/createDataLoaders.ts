import DataLoader from 'dataloader';

import { Models } from '../models';

function createLoaders(models: Models) {
  return {
    userLoader: new DataLoader(async (keys) => {
      const users = await models.User.find({
        _id: {
          $in: keys,
        },
      });

      return keys.map((userId) => users.find((user) => user?._id?.toString() === userId));
    }),
  };
}

export default createLoaders;
