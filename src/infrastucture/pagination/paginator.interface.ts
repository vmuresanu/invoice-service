export interface Paginator<T> {
  data: T;
  totalItems: number;
  totalPages: number;
  next?: string;
  previous?: string;
}
