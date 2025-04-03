import { toast } from "@/elements/toaster";
import { deleteBid } from "@/fetchs/collections/bids/delete-bid";
import { Collection } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBid = (collection: Collection) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (bidId: string) => deleteBid(collection, bidId),
      onError: (error) => {
        toast.error(
          'Something went wrong',
          error.message,
        );
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bids', collection.id] });
        toast.success('Success', 'Bid deleted successfully');
      },
    });
  };