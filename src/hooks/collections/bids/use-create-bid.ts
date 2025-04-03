import { toast } from "@/elements/toaster";
import { createBid } from "@/fetchs/collections/bids/create-bid";
import { BidUpsert } from "@/models/bid-upsert";
import { Collection } from "@/models/collection";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBid = (collection: Collection, options: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (creation: BidUpsert) => createBid(collection, creation),
      onError: () => {
        toast.error(
          'Something went wrong',
          'Failed to create bid',
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bids', collection.id] });
        toast.success('Success', 'Bid created successfully');
        options?.onSuccess?.()
      },
    });
  };