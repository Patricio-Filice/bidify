import { deleteCollection } from '@/fetchs/collections/delete-collection';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    }
  });
}