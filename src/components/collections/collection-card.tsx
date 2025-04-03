'use client';

import { useEffect, useRef, useState } from 'react';
import { Collection } from '@prisma/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../elements/collapsible';
import { Button } from '../../elements/button';
import { useBids } from '@/hooks/collections/bids/use-bids';
import Bids from './bids/bids';
import { Spinner } from '@/elements/spinner';

const DEFAULT_HEIGHT = 120;
const EXPANDED_LOADING_OFFSET = 120
const EXPANDED_LOADED_OFFSET = 140

export default function CollectionCard({ collection, onHeightChange }: { collection: Collection, onHeightChange?: (height: number) => void;}) {
  const [isOpen, setIsOpen] = useState(false);

  const { data: paginatedBids, isLoading }  = useBids(collection, { isEnabled: isOpen, refetchInterval: 5 * 1000 * 60 })

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onHeightChange) return;

    if (!isOpen) {
      onHeightChange(DEFAULT_HEIGHT);
      return;
    }

    if (isLoading || !paginatedBids?.items) {
      onHeightChange(DEFAULT_HEIGHT + EXPANDED_LOADING_OFFSET);
      return;
    }

    const calculateHeight = () => {
      if (!contentRef.current) return DEFAULT_HEIGHT + EXPANDED_LOADING_OFFSET;
      return contentRef.current.getBoundingClientRect().height + EXPANDED_LOADED_OFFSET;
    };

    const height = calculateHeight();
    onHeightChange(height);
  }, [isOpen, isLoading, paginatedBids, onHeightChange]);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
 };

  return (
    <Collapsible onOpenChange={handleOpenChange} className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col min-w-56">
          <h3 className="font-bold">{collection.name}</h3>
          <p className="text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis flex-initial min-w-0">{collection.description}</p>
          <p>Stocks: {collection.stocks} | Price: ${collection.price}</p>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="mt-auto">
            {isOpen ? 'Hide Bids' : 'Show Bids'}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      
      <CollapsibleContent ref={contentRef} className="mt-4">
        {isLoading ? (
          <Spinner></Spinner>
        ) : (
          <Bids 
            bids={paginatedBids?.items || []} 
            collection={collection}
            isOwner={true} // In real app, check against session
          />
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}