import { Collection } from "@/models/collection";

export async function deleteBid(colecction: Collection, bidId: string): Promise<void> {
    const res = await fetch(`/api/collections/${colecction.id}/bids/${bidId}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        throw new Error("Couldn't delete bid")
    }
}
