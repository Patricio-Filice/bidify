import { toast } from "@/elements/toaster"
import { acceptBid } from "@/fetchs/collections/bids/accept-bid"
import { Collection } from "@/models/collection"
import { PaginatedResponse } from "@/models/paginated-response"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type VirtualPaginatedCollectionResponse = { pages: PaginatedResponse<Collection>[] }

export const useAcceptBid = (collection: Collection) => {
    const queryClient = useQueryClient()

    // TODO: update state by using onMutate instead of invalidating query
    return useMutation({
      mutationFn: (bidId: string) => acceptBid(collection, bidId),
      onMutate: async () => {
        const previousPaginatedCollections = queryClient.getQueryData<PaginatedResponse<Collection>>(['collections']);

        queryClient.setQueryData(['collections'], (currentPaginatedCollections: VirtualPaginatedCollectionResponse) => {
          
          return {
            ...currentPaginatedCollections,
            pages: currentPaginatedCollections.pages.map(paginatedCollectionPage => {
              if (paginatedCollectionPage.items.every(c => c.id !== collection.id)) {
                return paginatedCollectionPage
              }

              return {
                ...paginatedCollectionPage,
                items: paginatedCollectionPage.items.map(c => c.id === collection.id ? { ...c, stocks: c.stocks - 1 } : c)
              }
            })
          } satisfies VirtualPaginatedCollectionResponse
      }); 

        return { previousPaginatedCollections };
      },
      onError: (error, _variables, context) => {
        queryClient.setQueryData(['collections'], context?.previousPaginatedCollections);
        toast.error('Something went wrong', error.message);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bids', collection.id] });

        queryClient.invalidateQueries({ 
          queryKey: ['collections', collection.id]
        })
        toast.success('Accepted bid', `Succesfully accepted bid from ${collection.name}`)
      }
    })
  }