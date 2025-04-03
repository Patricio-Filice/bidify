import { fetchCollections } from "@/fetchs/collections/fetch-collections";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useCollections({ name }: { name: string }) {
  return useInfiniteQuery({
    queryKey: ['collections'],
    queryFn: ({ pageParam }) => fetchCollections(pageParam + (name ? `&name=${name}` : '')),
    initialPageParam: 'page=1',
    getNextPageParam: (lastPage) => lastPage.meta.nextPage?.split('?')?.[1] ?? undefined,
  });
}
