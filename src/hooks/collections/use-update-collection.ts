import { toast } from "@/elements/toaster";
import { updateCollection } from "@/fetchs/collections/update-collection";
import { Collection } from "@/models/collection";
import { CollectionUpsert } from "@/models/collection-upsert";
import { PaginatedResponse } from "@/models/paginated-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type VirtualPaginatedCollectionResponse = { pages: PaginatedResponse<Collection>[] }

export const useUpdateCollection = (collectionId: string, options?: { onSuccess?: () => void }) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (update: CollectionUpsert) => updateCollection(collectionId, update),
      onMutate: async (update: CollectionUpsert) => {
  
        const previousPaginatedCollections = queryClient.getQueryData<PaginatedResponse<Collection>>(['collections']);
  
        console.warn(collectionId, previousPaginatedCollections)

        queryClient.setQueryData(['collections'], (currentPaginatedCollections: VirtualPaginatedCollectionResponse) => {
          
          return {
            ...currentPaginatedCollections,
            pages: currentPaginatedCollections.pages.map(paginatedCollectionPage => {
              if (paginatedCollectionPage.items.every(c => c.id !== collectionId)) {
                return paginatedCollectionPage
              }

              return {
                ...paginatedCollectionPage,
                items: paginatedCollectionPage.items.map(c => c.id === collectionId ? { ...c, ...update } : c)
              }
            })
          } satisfies VirtualPaginatedCollectionResponse
      });
  
        return { previousPaginatedCollections };
      },
      onError: (_err, _variables, context) => {
        queryClient.setQueryData(['collections'], context?.previousPaginatedCollections);
        toast.error('Something went wrong', 'Failed to update collection');
      },
      onSuccess: () => {
        toast.success('Success', 'Collection successfully updated');
        options?.onSuccess?.()
      },
    });
  };