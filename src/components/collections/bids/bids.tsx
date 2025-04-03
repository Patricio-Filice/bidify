'use client';

import { Button } from '@/elements/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/elements/table';
import { Bid } from '@prisma/client';
import { useState } from 'react';
import { BidDetails } from '@/models/bid-details';
import BidForm from './bid-form';
import { useAcceptBid } from '@/hooks/collections/bids/use-accept-bid';
import { UserAvatar } from '@/elements/user-avatar';
import { Collection } from '@/models/collection';
import { useDeleteBid } from '@/hooks/collections/bids/use-delete-bid';
import { useSession } from 'next-auth/react';

export default function BidTable({
  bids,
  collection
}: {
  bids: BidDetails[];
  collection: Collection;
}) {
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { data: session } = useSession();

  const { mutate: acceptBid, isPending: isAcceptPending } = useAcceptBid(collection)
  const { mutate: deleteBid, isPending: isDeletePending } = useDeleteBid(collection)

  const isActionInProgress = isAcceptPending || isDeletePending
  const isAuthenticated = !!session
  const isCollectionOwner = collection.id === session?.user.id
  const hasCurrentUserSomeBid = bids.some(b => b.userId === session?.user.id)
  const hasCollectionStock = collection.stocks > 0

  return (
    <div>
      { /** Prevents spam from users that want to push their bids on top */ }
      {isAuthenticated && collection.ownerId !== session?.user.id && !hasCurrentUserSomeBid && (
        <Button onClick={() => setIsCreating(true)} className="mb-4">
          Place New Bid
        </Button>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => (
            <TableRow key={bid.id}>
              <TableCell className="flex flex-row items-center gap-2">
                <UserAvatar user={bid.user}></UserAvatar>
                <p className="hidden sm:block max-w-40 text-ellipsis">
                  {bid.user.name}
                </p>
              </TableCell>
              <TableCell>${bid.price}</TableCell>
              <TableCell>{bid.status}</TableCell>
              <TableCell className="flex flex-row items-center gap-2">
                {isAuthenticated && isCollectionOwner && hasCollectionStock && bid.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acceptBid(bid.id)}
                    disabled={isActionInProgress}
                  >
                    Accept
                  </Button>
                )}
                {
                 isAuthenticated && bid.userId === session.user.id && bid.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBid(bid)}
                      disabled={isActionInProgress}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteBid(bid.id)}
                      disabled={isActionInProgress}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isCreating && (
        <BidForm
          collection={collection}
          onClose={() => setIsCreating(false)}
        />
      )}

      {editingBid && (
        <BidForm
          collection={collection}
          bid={editingBid}
          onClose={() => {
            setEditingBid(null)
          }}
        />
      )}
    </div>
  );
}