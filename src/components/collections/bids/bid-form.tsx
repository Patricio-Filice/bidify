'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/elements/form';
import { Input } from '@/elements/input';
import { Button } from '@/elements/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/elements/dialog';
import { Collection } from '@/models/collection';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Bid } from '@/models/bid';
import { useCreateBid } from '@/hooks/collections/bids/use-create-bid';
import { useUpdateBid } from '@/hooks/collections/bids/use-update-bid';

const formSchema = z.object({
  price: z.string().min(1, 'Price is required')
    .refine(val => !isNaN(parseFloat(val)), {
      message: "Must be a valid number"
    })
});

export default function BidForm({
  collection,
  bid,
  onClose
}: {
  collection: Collection;
  bid?: Bid;
  onClose: () => void;
}) {

  const isEditMode = !!bid
  const dialogAriaLabel = isEditMode ? `This dialog allows you to edit your bid to the collection ${collection.name}.` : `This dialog allows you to place a bid to the collection ${collection.name}.`

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: bid?.price.toString() || ''
    }
  });

  const optionsUpsert = {
    onSuccess: () => {
      onClose()
    }
  }

  const createBidMutation = useCreateBid(collection, optionsUpsert);
  const updateBidMutation = useUpdateBid(collection, bid?.id || '', optionsUpsert);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const price = parseFloat(values.price);

    if (isEditMode) {
      updateBidMutation.mutate({ price });
    } else {
      createBidMutation.mutate({ price });
    }
  };

  const isLoading = isEditMode 
    ? updateBidMutation.isPending 
    : createBidMutation.isPending;

  const handleKeyDown = (keyboardEvent: React.KeyboardEvent) => {
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const saveCopy = isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Place bid')

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogDescription>
        {dialogAriaLabel}
      </DialogDescription>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Bid' : 'Place New Bid'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button disabled={isLoading} variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                { saveCopy }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}