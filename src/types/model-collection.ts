export type TModelCollectionSearchParams<TSearchParams> = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
} & TSearchParams;

export type TModelCollection<
  TModel,
  TSearchParams = {
    page?: number;
    size?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  },
> = {
  items?: TModel[];
  total?: number;
} & TModelCollectionSearchParams<TSearchParams>;
