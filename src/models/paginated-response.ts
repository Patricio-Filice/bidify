export type PaginatedResponse<T> = {
  items: T[]
  meta: {
    limit: number
    page: number
    total: number
    totalPages: number
    nextPage: string
  } 
}