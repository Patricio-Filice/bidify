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

export default function BidTable({
  bids,
  collection,
  isOwner
}: {
  bids: BidDetails[];
  collection: Collection;
  isOwner: boolean;
}) {
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { mutate: acceptBid, isPending: isAcceptPending } = useAcceptBid(collection)

  return (
    <div>
      {(
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
                {isOwner && bid.status === 'PENDING' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acceptBid(bid.id)}
                    disabled={isAcceptPending}
                  >
                    Accept
                  </Button>
                )}
                {bid.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingBid(bid)}
                    >
                      Edit
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