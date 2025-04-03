import { Collection } from "@/models/collection";

export async function acceptBid(collection: Collection, bidId: string): Promise<void> {
    const res = await fetch(`/api/collections/${collection.id}/bids/${bidId}/accept`, {
      method: 'POST'
    });
    if (!res.ok) {
      throw new Error(`Couldn't accept bid from ${collection.name}`)
    }
}
