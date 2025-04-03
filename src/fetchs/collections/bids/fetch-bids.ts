import { BidDetails } from "@/models/bid-details";
import { Collection } from "@/models/collection";
import { PaginatedResponse } from "@/models/paginated-response";

export async function fetchBids(collection: Collection): Promise<PaginatedResponse<BidDetails>> {
    const response = await fetch(`/api/collections/${collection.id}/bids`);
    if (!response.ok) {
      throw new Error(`Couldn't fetch bids of ${collection.name}`)
    }
    return await response.json();
}
