'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PlusIcon, SearchIcon } from 'lucide-react';
import { Collection } from '@/models/collection';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCollections } from '@/hooks/collections/use-collections';
import { CollectionsSkeleton } from './collections.skeleton';
import { Button } from '@/elements/button';
import { ErrorAlert } from '@/elements/alert-error';
import CollectionCard from './collection-card';
import CollectionForm from './collection-form';
import { useDeleteCollection } from '@/hooks/collections/use-delete-collection';
import { VirtualRowState } from '@/models/virtual-row-state';
import { Input } from '@/elements/input';
import { useSession } from 'next-auth/react';

export function Collections() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();

  const isAuthenticated = !!session

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    refetch
  } = useCollections({ name: searchTerm });
  const { mutate: deleteCollection } = useDeleteCollection();

  const collections = data?.pages.flatMap(page => page.items) || [];

  const rowIndexToStateMap = useRef(new Map<number, VirtualRowState>());

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? collections.length + 1 : collections.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => rowIndexToStateMap.current.get(index)?.height ||  120,
    overscan: 5,
  });
  const items = rowVirtualizer.getVirtualItems();

  const updateRowState = useCallback((virtualRowState: VirtualRowState) => {
    const currentVirtualRowState = rowIndexToStateMap.current.get(virtualRowState.index)

    if (currentVirtualRowState?.height === virtualRowState.height) {
      return
    }

    rowIndexToStateMap.current.set(virtualRowState.index, virtualRowState);
    
    rowVirtualizer.measure();    
  }, [rowVirtualizer]);

  useEffect(() => {
    const [lastItem] = [...items].reverse();
    if (!lastItem || lastItem.index < collections.length - 1 || !hasNextPage) return;
    
    fetchNextPage();
  }, [items, hasNextPage, fetchNextPage, collections.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch();
    }, 300)

    return () => clearTimeout(timer);
  }, [searchTerm, refetch])

  if (status === 'pending') {
    return <CollectionsSkeleton />
  }

  if (status === 'error') {
    return (
      <ErrorAlert 
        title="Error while retrieving collections"
        error={error}
      ></ErrorAlert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections by name..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isAuthenticated && <Button onClick={() => setIsCreating(true)} className="shrink-0 max-w-[448px]">
          <PlusIcon className="mr-2 h-4 w-4" />
          New Collection
        </Button>}
      </div>

      { collections.length === 0 && <p className="text-md mx-auto w-fit mt-8">No collections found.</p> }
      <div
        ref={parentRef}
        className="h-[calc(100vh-250px)] w-full overflow-auto"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {items.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > collections.length - 1;
            const collection = collections[virtualRow.index];
            const isOwner = collection && session?.user.id === collection.ownerId

            // TODO: Move virtual scroller on it's own component
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  isFetchingNextPage ? (
                    <div className="p-4">
                      <CollectionsSkeleton count={2} />
                    </div>
                  ) : null
                ) : (
                  <div key={collection.id} className="relative group">
                  {/* Owner actions floating on the right */}
                  {isOwner && (
                    <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCollection(collection)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCollection(collection.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
        
                  {/* Collection Card */}
                  <CollectionCard 
                    collection={collection}
                    onHeightChange={(height) => updateRowState({ index: virtualRow.index, height })}
                  />
                </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {
        isCreating &&
        <CollectionForm
        onClose={() => setIsCreating(false)}
      />
      }     
      {
        editingCollection &&
        <CollectionForm
        collection={editingCollection}
        onClose={() => setEditingCollection(null)}
      />
      }      
    </div>
  );
}