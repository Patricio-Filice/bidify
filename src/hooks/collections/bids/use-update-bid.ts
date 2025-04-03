import { toast } from "@/elements/toaster";
import { updateBid } from "@/fetchs/collections/bids/update-bid";
import { BidDetails } from "@/models/bid-details";
import { BidUpsert } from "@/models/bid-upsert";
import { Collection } from "@/models/collection";
import { PaginatedResponse } from "@/models/paginated-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateBid = (collection: Collection, bidId: string, options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (update: BidUpsert) => updateBid(collection, bidId, update),
      onMutate: async (update: BidUpsert) => {
        await queryClient.cancelQueries({ queryKey: ['bids', collection.id] });
  
        const previousPaginatedBids = queryClient.getQueryData<PaginatedResponse<BidDetails>>(['bids', collection.id]);
  
        queryClient.setQueryData(['bids', collection.id], (currentPaginatedBids: PaginatedResponse<BidDetails>) => ({
            ...currentPaginatedBids,
            items: currentPaginatedBids.items.map(bid => bid.id === bidId ? { ...bid, ...update } : bid)
        } satisfies PaginatedResponse<BidDetails>));
  
        return { previousPaginatedBids };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(['bids', collection.id], context?.previousPaginatedBids);
        toast.error('Something went wrong', 'Failed to update bid');
      },
      onSuccess: () => {
        toast.success('Success', 'Bid successfully updated');
        options?.onSuccess?.()
      },
    });
  };