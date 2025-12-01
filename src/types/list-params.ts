export type TListParams<TSortBy extends string> = {
  page: number;
  size: number;
  sortBy?: TSortBy;
  sortOrder?: 'asc' | 'desc';
  search?: string;
};
