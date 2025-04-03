import { PaginatedResponse } from "@/models/paginated-response";
import { Collection } from "@prisma/client";

export async function fetchCollections(queryParams?: string): Promise<PaginatedResponse<Collection>> {
  const response = await fetch(`/api/collections${queryParams ? '?' + queryParams : ''}`);
  if (!response.ok) {
    throw new Error("Couldn't fetch collections")
  }
  return await response.json();
}
