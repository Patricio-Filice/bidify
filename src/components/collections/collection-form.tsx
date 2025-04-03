'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Collection } from '@prisma/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/elements/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/elements/form';
import { Input } from '@/elements/input';
import { Button } from '@/elements/button';
import { useCreateCollection } from '@/hooks/collections/use-create-collection';
import { useUpdateCollection } from '@/hooks/collections/use-update-collection';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  stocks: z.coerce.number().min(1, 'Must have at least 1 stock'),
  price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
});

type FormValues = z.infer<typeof formSchema>;

export default function CollectionForm({
  collection,
  onClose
}: {
  collection?: Partial<Collection>;
  onClose: () => void;
}) {
  const isEditMode = !!collection

  const dialogAriaLabel = isEditMode ? `This dialog allows you to edit the information of the collection ${collection.name}.` : 'This dialog allows you to create a collection.'

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: collection?.name || '',
      description: collection?.description || '',
      stocks: collection?.stocks || 1,
      price: collection?.price || 0
    },
  });

  const optionsUpsert = {
    onSuccess: () => {
      onClose()
    }
  }

  const createCollectionMutation = useCreateCollection(optionsUpsert);
  const updateCollectionMutation = useUpdateCollection(collection?.id || '', optionsUpsert);
  
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
  
      if (isEditMode) {
        updateCollectionMutation.mutate(values);
      } else {
        createCollectionMutation.mutate(values);
      }
    };
  
    const isLoading = isEditMode 
      ? updateCollectionMutation.isPending 
      : createCollectionMutation.isPending;

  const handleKeyDown = (keyboardEvent: React.KeyboardEvent) => {
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const saveCopy = isLoading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')

  return (
    <Dialog open onOpenChange={onClose}>
     <DialogDescription>
        {dialogAriaLabel}
      </DialogDescription>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Edit Collection' : 'Create Collection'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Collection name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Collection description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stocks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0.01" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                { saveCopy }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}