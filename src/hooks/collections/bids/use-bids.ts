import { fetchBids } from "@/fetchs/collections/bids/fetch-bids"
import { Collection } from "@/models/collection"
import { useQuery } from '@tanstack/react-query'

export const useBids = (collection: Collection, options?: {
    isEnabled?: boolean
    staleTime?: number
    refetchInterval?: number
  }) => {
    return useQuery({
      queryKey: ['bids', collection.id],
      queryFn: () => fetchBids(collection),
      enabled: options?.isEnabled && !!collection.id,
      staleTime: options?.staleTime,
      refetchInterval: options?.refetchInterval,
    })
  }