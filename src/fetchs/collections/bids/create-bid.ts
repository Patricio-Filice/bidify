import { BidUpsert } from "@/models/bid-upsert";
import { Collection } from "@/models/collection";

export async function createBid(collection: Collection, creation: BidUpsert): Promise<void> {
    const response = await fetch(`/api/collections/${collection.id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(creation),
      });
    
      if (!response.ok) {
        throw new Error(`Couldn't to create bid for collection ${collection.name}`);
      }
    
      return response.json();
}
