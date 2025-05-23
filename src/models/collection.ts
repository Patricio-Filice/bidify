import { Collection as CollectionModel } from '@prisma/client';

export type Collection = CollectionModel & {
  owner: {
    name: string
  }
}
