import { toast } from "@/elements/toaster"
import { acceptBid } from "@/fetchs/collections/bids/accept-bid"
import { Collection } from "@/models/collection"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAcceptBid = (collection: Collection) => {
    const queryClient = useQueryClient()

    // TODO: update state by using onMutate instead of invalidating query
    return useMutation({
      mutationFn: (bidId: string) => acceptBid(collection, bidId),
      onError: (error) => {
        toast.error('Something went wrong', error.message)
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ 
          queryKey: ['collections', collection.id]
        })
        toast.success('Accepted bid', `Succesfully accepted bid from ${collection.name}`)
      }
    })
  }