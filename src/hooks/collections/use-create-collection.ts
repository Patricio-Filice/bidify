import { toast } from "@/elements/toaster";
import { createCollection } from "@/fetchs/collections/create-collection";
import { CollectionUpsert } from "@/models/collection-upsert";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCollection = (options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (create: CollectionUpsert) => createCollection(create),
      onError: (error) => {
        toast.error('Something went wrong', error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['collections'] })
        toast.success('Success', 'Collection successfully created');
        options?.onSuccess?.()
      },
    });
  };