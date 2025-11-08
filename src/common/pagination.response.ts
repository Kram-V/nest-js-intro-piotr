export interface PaginationResponse<T> {
  data: T[];

  meta: {
    total: number;
    offset: number | undefined;
    limit: number | undefined;
  };
}
