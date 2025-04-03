import { CollectionUpsert } from "@/models/collection-upsert";

export async function createCollection(creation: CollectionUpsert) {
    const response = await fetch(`/api/collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creation),
      });
  
      if (!response.ok) {
        throw new Error(`Couldn't create collection`);
      }
}
