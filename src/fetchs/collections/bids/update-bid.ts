import { BidUpsert } from "@/models/bid-upsert";
import { Collection } from "@/models/collection";


export async function updateBid(collection: Collection, bidId: string, update: BidUpsert): Promise<void> {
    const response = await fetch(`/api/collections/${collection.id}/bids/${bidId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      throw new Error(`Couldn't update bid`);
    }
}
