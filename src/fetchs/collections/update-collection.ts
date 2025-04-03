import { CollectionUpsert } from "@/models/collection-upsert";

export async function updateCollection(collectionId: string, update: CollectionUpsert) {
  console.warn(collectionId, update)
  const response = await fetch(`/api/collections/${collectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(update),
      });
  
    if (!response.ok) {
      throw new Error(`Couldn't update collection`);
    }
}
