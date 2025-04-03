export async function deleteCollection(collectionId: string): Promise<void> {
  const res = await fetch(`/api/collections/${collectionId}`, {
      method: 'DELETE'
    });
  if (!res.ok) {
      throw new Error(`Couldn't delete collection`)
  }
}
